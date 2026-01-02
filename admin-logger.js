/**
 * Admin Activity Logger
 * Tracks all data changes (create, update, delete) in Firebase
 * Stores logs in Firebase for viewing in admin console
 */

class AdminLogger {
  constructor(database, section = 'Track') {
    this.database = database;
    this.section = section;
    this.logsPath = `admin_logs/${section}`;
  }

  /**
   * Get user identifier (browser-based, can be enhanced with auth)
   */
  getUserIdentifier() {
    // Try to get from localStorage if set
    const stored = localStorage.getItem('admin_user_name');
    if (stored) return stored;
    
    // Fallback to browser info
    const ua = navigator.userAgent;
    const device = /Mobile|Android|iPhone|iPad/.test(ua) ? 'Mobile' : 'Desktop';
    return `Admin (${device})`;
  }

  /**
   * Set admin user name for logging
   */
  setUserName(name) {
    localStorage.setItem('admin_user_name', name);
  }

  /**
   * Log an activity
   */
  async logActivity(action, entityType, entityId, details = {}) {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        timestampReadable: new Date().toLocaleString(),
        action: action, // 'create', 'update', 'delete'
        entityType: entityType, // 'meet', 'event', 'athlete', etc.
        entityId: entityId,
        user: this.getUserIdentifier(),
        details: details,
        section: this.section
      };

      // Store in Firebase
      const logRef = this.database.ref(this.logsPath).push();
      await logRef.set(logEntry);

      return logRef.key;
    } catch (error) {
      console.error('Failed to log activity:', error);
      // Don't throw - logging failures shouldn't break the app
      return null;
    }
  }

  /**
   * Log a create operation
   */
  async logCreate(entityType, entityId, data) {
    return this.logActivity('create', entityType, entityId, {
      data: data,
      summary: `Created new ${entityType}`
    });
  }

  /**
   * Log an update operation
   */
  async logUpdate(entityType, entityId, oldData, newData) {
    // Calculate what changed
    const changes = {};
    Object.keys(newData).forEach(key => {
      if (oldData[key] !== newData[key]) {
        changes[key] = {
          from: oldData[key],
          to: newData[key]
        };
      }
    });

    return this.logActivity('update', entityType, entityId, {
      changes: changes,
      summary: `Updated ${entityType}: ${Object.keys(changes).length} field(s) changed`
    });
  }

  /**
   * Log a delete operation
   */
  async logDelete(entityType, entityId, deletedData) {
    return this.logActivity('delete', entityType, entityId, {
      deletedData: deletedData,
      summary: `Deleted ${entityType}`
    });
  }

  /**
   * Get recent logs
   */
  async getRecentLogs(limit = 100) {
    try {
      const snapshot = await this.database
        .ref(this.logsPath)
        .orderByChild('timestamp')
        .limitToLast(limit)
        .once('value');

      const logs = [];
      snapshot.forEach(child => {
        logs.push({
          id: child.key,
          ...child.val()
        });
      });

      // Reverse to show newest first
      return logs.reverse();
    } catch (error) {
      console.error('Failed to get logs:', error);
      return [];
    }
  }

  /**
   * Get logs filtered by action, entity type, or date range
   */
  async getFilteredLogs(filters = {}) {
    try {
      let query = this.database.ref(this.logsPath).orderByChild('timestamp');

      if (filters.limit) {
        query = query.limitToLast(filters.limit);
      }

      const snapshot = await query.once('value');
      const logs = [];
      
      snapshot.forEach(child => {
        const log = { id: child.key, ...child.val() };
        
        // Apply filters
        if (filters.action && log.action !== filters.action) return;
        if (filters.entityType && log.entityType !== filters.entityType) return;
        if (filters.user && !log.user.includes(filters.user)) return;
        if (filters.startDate && log.timestamp < filters.startDate) return;
        if (filters.endDate && log.timestamp > filters.endDate) return;

        logs.push(log);
      });

      return logs.reverse();
    } catch (error) {
      console.error('Failed to get filtered logs:', error);
      return [];
    }
  }

  /**
   * Clear old logs (keep last N days)
   */
  async clearOldLogs(daysToKeep = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      const cutoffTimestamp = cutoffDate.toISOString();

      const snapshot = await this.database
        .ref(this.logsPath)
        .orderByChild('timestamp')
        .endAt(cutoffTimestamp)
        .once('value');

      const updates = {};
      snapshot.forEach(child => {
        updates[child.key] = null;
      });

      if (Object.keys(updates).length > 0) {
        await this.database.ref(this.logsPath).update(updates);
      }

      return Object.keys(updates).length;
    } catch (error) {
      console.error('Failed to clear old logs:', error);
      return 0;
    }
  }
}

// Export for use in admin pages
if (typeof window !== 'undefined') {
  window.AdminLogger = AdminLogger;
}

