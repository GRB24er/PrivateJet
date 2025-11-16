import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, changePassword } from "../api/user.js";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (user) {
      const changed = profile.name !== (user.name || "") || profile.phone !== (user.phone || "");
      setHasChanges(changed);
    }
  }, [profile, user]);

  const loadProfile = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
      setProfile({ 
        name: userData.name || "", 
        phone: userData.phone || "" 
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const handlePasswordChange = (field, value) => {
    setPassword({ ...password, [field]: value });
    if (field === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    if (passwordStrength <= 4) return "Good";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "#ef4444";
    if (passwordStrength <= 3) return "#f59e0b";
    if (passwordStrength <= 4) return "#3b82f6";
    return "#22c55e";
  };

  const saveProfile = async () => {
    if (!hasChanges) return;
    
    setSaving(true);
    try {
      const updated = await updateProfile(profile);
      setUser(updated);
      setHasChanges(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (password.newPassword !== password.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (password.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword
      });
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordStrength(0);
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCancelChanges = () => {
    setProfile({
      name: user.name || "",
      phone: user.phone || ""
    });
    setHasChanges(false);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-skeleton">
            <div className="skeleton-header">
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-subtitle" />
            </div>
            <div className="skeleton-cards">
              <div className="skeleton-card">
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-error">
            <div className="error-icon">⚠️</div>
            <h3>Profile Not Found</h3>
            <p>Unable to load your profile information</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <motion.div 
          className="profile-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="header-content">
            <h1 className="page-title">Account Settings</h1>
            <p className="page-subtitle">
              Manage your account information and security settings
            </p>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="profile-grid">
          {/* Left Column - Profile Info */}
          <div className="profile-main">
            {/* Profile Card */}
            <motion.section 
              className="profile-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="section-header">
                <div className="section-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <h2 className="section-title">Profile Information</h2>
                  <p className="section-desc">Update your personal details</p>
                </div>
              </div>

              <div className="section-content">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="avatar-info">
                    <h3 className="avatar-name">{user.name || "User"}</h3>
                    <p className="avatar-role">{user.role === 'admin' ? 'Administrator' : 'Member'}</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-text">Email Address</span>
                      <span className="label-badge">Verified</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </span>
                      <input
                        type="email"
                        className="form-input input-readonly"
                        value={user.email}
                        readOnly
                        disabled
                      />
                      <span className="input-lock">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </span>
                    </div>
                    <p className="input-hint">Your email cannot be changed</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </span>
                      <input
                        id="name"
                        type="text"
                        className="form-input"
                        placeholder="John Smith"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      <span className="label-text">Phone Number</span>
                      <span className="label-optional">Optional</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </span>
                      <input
                        id="phone"
                        type="tel"
                        className="form-input"
                        placeholder="+1 (555) 000-0000"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {hasChanges && (
                  <motion.div 
                    className="form-actions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button 
                      onClick={handleCancelChanges} 
                      className="btn btn-ghost"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={saveProfile} 
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <span>Save Changes</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.section>

            {/* Security Section */}
            <motion.section 
              className="profile-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="section-header">
                <div className="section-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="section-title">Security</h2>
                  <p className="section-desc">Manage your password and security preferences</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="section-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="currentPassword" className="form-label">
                      <span className="label-text">Current Password</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </span>
                      <input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        className="form-input"
                        placeholder="Enter current password"
                        value={password.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="input-action"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">
                      <span className="label-text">New Password</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </span>
                      <input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        className="form-input"
                        placeholder="Enter new password"
                        value={password.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="input-action"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {password.newPassword && (
                      <div className="password-strength">
                        <div className="strength-bar">
                          <div 
                            className="strength-fill" 
                            style={{ 
                              width: `${(passwordStrength / 5) * 100}%`,
                              backgroundColor: getPasswordStrengthColor()
                            }}
                          />
                        </div>
                        {passwordStrength > 0 && (
                          <span 
                            className="strength-label"
                            style={{ color: getPasswordStrengthColor() }}
                          >
                            {getPasswordStrengthLabel()}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="input-hint">
                      Use 8+ characters with a mix of letters, numbers & symbols
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      <span className="label-text">Confirm New Password</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </span>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-input"
                        placeholder="Confirm new password"
                        value={password.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="input-action"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {password.newPassword && password.confirmPassword && (
                      <p className={`input-validation ${password.newPassword === password.confirmPassword ? 'valid' : 'invalid'}`}>
                        {password.newPassword === password.confirmPassword ? '✓ Passwords match' : '× Passwords do not match'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit"
                    className="btn btn-primary"
                    disabled={changingPassword}
                  >
                    {changingPassword ? (
                      <>
                        <span className="spinner" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <span>Update Password</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.section>
          </div>

          {/* Right Column - Account Info & Actions */}
          <div className="profile-sidebar">
            <motion.section 
              className="sidebar-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="sidebar-title">Account Status</h3>
              <div className="status-grid">
                <div className="status-item">
                  <div className="status-icon status-active">✓</div>
                  <div className="status-content">
                    <div className="status-label">Email</div>
                    <div className="status-value">Verified</div>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-icon status-active">✓</div>
                  <div className="status-content">
                    <div className="status-label">Account</div>
                    <div className="status-value">Active</div>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-icon status-info">i</div>
                  <div className="status-content">
                    <div className="status-label">Role</div>
                    <div className="status-value">{user.role === 'admin' ? 'Administrator' : 'Member'}</div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section 
              className="sidebar-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="sidebar-title">Security Tips</h3>
              <div className="tips-list">
                <div className="tip-item">
                  <div className="tip-icon">🔒</div>
                  <p className="tip-text">Use a strong, unique password</p>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">📱</div>
                  <p className="tip-text">Enable two-factor authentication</p>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">🔄</div>
                  <p className="tip-text">Change password regularly</p>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}