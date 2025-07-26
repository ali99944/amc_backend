# API Endpoint Mapping

This document shows the mapping between the Laravel API routes and the frontend API service calls.

## ✅ Complete API Coverage

All API endpoints from `routes/api.php` are now implemented in the frontend API service.

## 🔧 Utility API

| Frontend Method | API Endpoint | Method | Status |
|----------------|--------------|--------|--------|
| `utilityApi.health()` | `/health` | GET | ✅ Implemented |
| `utilityApi.version()` | `/version` | GET | ✅ Implemented |
| `utilityApi.testRateLimit()` | `/debug/rate-limit` | GET | ✅ Implemented |

## 🔐 Authentication API

| Frontend Method | API Endpoint | Method | Status |
|----------------|--------------|--------|--------|
| `authApi.login()` | `/auth/login` | POST | ✅ Implemented |
| `authApi.register()` | `/auth/register` | POST | ✅ Implemented |
| `authApi.logout()` | `/auth/logout` | POST | ✅ Implemented |
| `authApi.getUser()` | `/auth/profile` | GET | ✅ Implemented (mapped to profile) |
| `authApi.getUserProfile()` | `/auth/profile` | GET | ✅ Implemented |
| `authApi.updateProfile()` | `/auth/profile` | PUT | ✅ Implemented |
| `authApi.updatePassword()` | `/auth/password` | PUT | ✅ Implemented |
| `authApi.switchTeam()` | `/auth/switch-team` | POST | ✅ Implemented |
| `authApi.getCurrentTeam()` | `/auth/current-team` | GET | ✅ Implemented |
| `authApi.getUserTeams()` | `/auth/teams` | GET | ✅ Implemented |
| `authApi.forgotPassword()` | `/auth/forgot-password` | POST | ✅ Implemented |
| `authApi.resetPassword()` | `/auth/reset-password` | POST | ✅ Implemented |
| `authApi.refreshToken()` | `/auth/refresh` | POST | ✅ Implemented |
| `authApi.sendVerificationEmail()` | `/auth/email/resend` | POST | ✅ Implemented |
| `authApi.verifyEmail()` | `/auth/email/verify/{id}/{hash}` | GET | ✅ Implemented |
| `authApi.setup2FA()` | `/auth/2fa/setup` | POST | ✅ Implemented |
| `authApi.enable2FA()` | `/auth/2fa/enable` | POST | ✅ Implemented |
| `authApi.disable2FA()` | `/auth/2fa/disable` | POST | ✅ Implemented |
| `authApi.verify2FA()` | `/auth/2fa/verify` | POST | ✅ Implemented |
| `authApi.regenerateBackupCodes()` | `/auth/2fa/regenerate-codes` | POST | ✅ Implemented |
| `authApi.exportData()` | `/auth/export-data` | GET | ✅ Implemented |
| `authApi.deleteAccount()` | `/auth/delete-account` | DELETE | ✅ Implemented |
| `authApi.anonymizeData()` | `/auth/anonymize` | POST | ✅ Implemented |
| `authApi.getUserSessions()` | `/auth/sessions` | GET | ✅ Implemented |
| `authApi.revokeSession()` | `/auth/sessions/{tokenId}` | DELETE | ✅ Implemented |
| `authApi.revokeAllOtherSessions()` | `/auth/sessions/revoke-all` | DELETE | ✅ Implemented |
| `authApi.getSecurityStatus()` | `/auth/security-status` | GET | ✅ Implemented |

## 🔗 Social Authentication API

| Frontend Method | API Endpoint | Method | Status |
|----------------|--------------|--------|--------|
| `socialAuthApi.redirect()` | `/auth/{provider}/redirect` | GET | ✅ Implemented |
| `socialAuthApi.callback()` | `/auth/{provider}/callback` | GET | ✅ Implemented |
| `socialAuthApi.linkAccount()` | `/auth/{provider}/link` | POST | ✅ Implemented |
| `socialAuthApi.unlinkAccount()` | `/auth/{provider}/unlink` | DELETE | ✅ Implemented |

## 👥 Team API

| Frontend Method | API Endpoint | Method | Status |
|----------------|--------------|--------|--------|
| `teamApi.getTeams()` | `/teams` | GET | ✅ Implemented |
| `teamApi.getCurrentTeam()` | `/auth/current-team` | GET | ✅ Implemented |
| `teamApi.getUserTeams()` | `/auth/teams` | GET | ✅ Implemented |
| `teamApi.getTeam()` | `/teams/{team}` | GET | ✅ Implemented |
| `teamApi.createTeam()` | `/teams` | POST | ✅ Implemented |
| `teamApi.updateTeam()` | `/teams/{team}` | PUT | ✅ Implemented |
| `teamApi.deleteTeam()` | `/teams/{team}` | DELETE | ✅ Implemented |
| `teamApi.getTeamMembers()` | `/teams/{team}/members` | GET | ✅ Implemented |
| `teamApi.inviteMember()` | `/teams/{team}/members` | POST | ✅ Implemented |
| `teamApi.updateMember()` | `/teams/{team}/members/{teamUser}` | PUT | ✅ Implemented |
| `teamApi.removeMember()` | `/teams/{team}/members/{teamUser}` | DELETE | ✅ Implemented |
| `teamApi.getTeamAnalytics()` | `/teams/{team}/analytics` | GET | ✅ Implemented |
| `teamApi.acceptInvitation()` | `/team/invitation/{token}/accept` | GET | ✅ Implemented |
| `teamApi.declineInvitation()` | `/team/invitation/{token}/decline` | GET | ✅ Implemented |

## 💳 Subscription API

| Frontend Method | API Endpoint | Method | Status |
|----------------|--------------|--------|--------|
| `subscriptionApi.getPlans()` | `/plans` | GET | ✅ Implemented |
| `subscriptionApi.getPlan()` | `/plans/{plan}` | GET | ✅ Implemented |
| `subscriptionApi.getSubscriptions()` | `/teams/{team}/subscriptions` | GET | ✅ Implemented |
| `subscriptionApi.getSubscription()` | `/teams/{team}/subscriptions/{subscription}` | GET | ✅ Implemented |
| `subscriptionApi.createSubscription()` | `/teams/{team}/subscriptions` | POST | ✅ Implemented |
| `subscriptionApi.updateSubscription()` | `/teams/{team}/subscriptions/{subscription}` | PUT | ✅ Implemented |
| `subscriptionApi.cancelSubscription()` | `/teams/{team}/subscriptions/{subscription}` | DELETE | ✅ Implemented |
| `subscriptionApi.resumeSubscription()` | `/teams/{team}/subscriptions/{subscription}/resume` | GET | ✅ Implemented |
| `subscriptionApi.getInvoices()` | `/teams/{team}/invoices` | GET | ✅ Implemented |
| `subscriptionApi.getInvoice()` | `/teams/{team}/invoices/{invoice_id}` | GET | ✅ Implemented |
| `subscriptionApi.getSubscriptionAnalytics()` | `/teams/{team}/subscriptions/analytics` | GET | ✅ Implemented |

## 🪙 Credit API

| Frontend Method | API Endpoint | Method | Status |
|----------------|--------------|--------|--------|
| `creditApi.getCredits()` | `/teams/{team}/credits` | GET | ✅ Implemented |
| `creditApi.getCreditTransactions()` | `/teams/{team}/credits/transactions` | GET | ✅ Implemented |
| `creditApi.getCreditPackages()` | `/credit-packages` | GET | ✅ Implemented |
| `creditApi.getCreditPurchases()` | `/teams/{team}/credits/purchases` | GET | ✅ Implemented |
| `creditApi.purchaseCredits()` | `/teams/{team}/credits/purchase` | POST | ✅ Implemented |
| `creditApi.useCredits()` | `/teams/{team}/credits/use` | POST | ✅ Implemented |
| `creditApi.getCreditAnalytics()` | `/teams/{team}/credits/analytics` | GET | ✅ Implemented |
| `creditApi.getGlobalCredits()` | `/credits` | GET | ✅ Implemented |
| `creditApi.getGlobalTransactions()` | `/credits/transactions` | GET | ✅ Implemented |
| `creditApi.useGlobalCredits()` | `/credits/use` | POST | ✅ Implemented |
| `creditApi.purchaseGlobalCredits()` | `/credits/purchase` | POST | ✅ Implemented |
| `creditApi.getGlobalPurchases()` | `/credits/purchases` | GET | ✅ Implemented |

## 🪑 Seat API

| Frontend Method | API Endpoint | Method | Status |
|----------------|--------------|--------|--------|
| `seatApi.getSeats()` | `/teams/{team}/seats` | GET | ✅ Implemented |
| `seatApi.getSeat()` | `/teams/{team}/seats/{seat}` | GET | ✅ Implemented |
| `seatApi.allocateSeat()` | `/teams/{team}/seats` | POST | ✅ Implemented |
| `seatApi.updateSeat()` | `/teams/{team}/seats/{seat}` | PUT | ✅ Implemented |
| `seatApi.deallocateSeat()` | `/teams/{team}/seats/{seat}` | DELETE | ✅ Implemented |
| `seatApi.getSeatUsage()` | `/teams/{team}/seats/{seat}/usage` | GET | ✅ Implemented |
| `seatApi.getSeatAnalytics()` | `/teams/{team}/seats/analytics` | GET | ✅ Implemented |

## 🔔 Notification API

| Frontend Method | API Endpoint | Method | Status |
|----------------|--------------|--------|--------|
| `notificationApi.getNotifications()` | `/notifications` | GET | ✅ Implemented |
| `notificationApi.getNotification()` | `/notifications/{notification}` | GET | ✅ Implemented |
| `notificationApi.markAsRead()` | `/notifications/{notification}/read` | PUT | ✅ Implemented |
| `notificationApi.markAllAsRead()` | `/notifications/read-all` | PUT | ✅ Implemented |
| `notificationApi.deleteNotification()` | `/notifications/{notification}` | DELETE | ✅ Implemented |
| `notificationApi.getNotificationSettings()` | `/notifications/settings` | GET | ✅ Implemented |
| `notificationApi.updateNotificationSettings()` | `/notifications/settings` | PUT | ✅ Implemented |
| `notificationApi.getUnreadCount()` | `/notifications/unread-count` | GET | ✅ Implemented |
| `notificationApi.getTeamNotifications()` | `/teams/{team}/notifications` | GET | ✅ Implemented |

## 👨‍💼 Admin API

| Frontend Method | API Endpoint | Method | Status |
|----------------|--------------|--------|--------|
| `adminApi.login()` | `/admin/auth/login` | POST | ✅ Implemented |
| `adminApi.logout()` | `/admin/auth/logout` | POST | ✅ Implemented |
| `adminApi.getProfile()` | `/admin/auth/profile` | GET | ✅ Implemented |
| `adminApi.updateProfile()` | `/admin/auth/profile` | PUT | ✅ Implemented |
| `adminApi.getDashboard()` | `/admin/dashboard` | GET | ✅ Implemented |
| `adminApi.getTeams()` | `/admin/teams` | GET | ✅ Implemented |
| `adminApi.getTeam()` | `/admin/teams/{team}` | GET | ✅ Implemented |
| `adminApi.updateTeam()` | `/admin/teams/{team}` | PUT | ✅ Implemented |
| `adminApi.deleteTeam()` | `/admin/teams/{team}` | DELETE | ✅ Implemented |
| `adminApi.suspendTeam()` | `/admin/teams/{team}/suspend` | POST | ✅ Implemented |
| `adminApi.activateTeam()` | `/admin/teams/{team}/activate` | POST | ✅ Implemented |
| `adminApi.getAnalytics()` | `/admin/teams/analytics` | GET | ✅ Implemented |
| `adminApi.getTeamAnalytics()` | `/admin/teams/{team}/analytics` | GET | ✅ Implemented |
| `adminApi.getUsers()` | `/admin/users` | GET | ✅ Implemented |
| `adminApi.getUser()` | `/admin/users/{user}` | GET | ✅ Implemented |
| `adminApi.updateUser()` | `/admin/users/{user}` | PUT | ✅ Implemented |
| `adminApi.deleteUser()` | `/admin/users/{user}` | DELETE | ✅ Implemented |
| `adminApi.getWebhooks()` | `/admin/webhooks` | GET | ✅ Implemented |
| `adminApi.getWebhook()` | `/admin/webhooks/{webhook}` | GET | ✅ Implemented |
| `adminApi.retryWebhook()` | `/admin/webhooks/{webhook}/retry` | POST | ✅ Implemented |

## 🔗 Webhook API

| Frontend Method | API Endpoint | Method | Status |
|----------------|--------------|--------|--------|
| `webhookApi.handleStripeWebhook()` | `/webhooks/stripe` | POST | ✅ Implemented |
| `webhookApi.testStripeWebhook()` | `/webhooks/stripe/test` | GET | ✅ Implemented |

## 📊 Summary

- **Total API Endpoints**: 85+
- **Frontend Coverage**: 100% ✅
- **All endpoints mapped**: ✅
- **Authentication handled**: ✅
- **Error handling**: ✅
- **Type safety**: ✅

## 🔧 Key Fixes Applied

1. **Fixed missing `/auth/user` endpoint** - Now uses `/auth/profile`
2. **Corrected team routes** - Changed from `/user/*` to `/auth/*`
3. **Fixed notification settings** - Changed from `/notification-settings` to `/notifications/settings`
4. **Corrected invitation endpoints** - Changed from POST to GET with token in URL
5. **Fixed email verification** - Updated to use correct path format
6. **Added missing admin endpoints** - Complete admin API coverage
7. **Added social auth endpoints** - Complete social authentication support
8. **Added utility endpoints** - Health checks and debugging
9. **Added webhook endpoints** - Stripe webhook handling
10. **Added global credit endpoints** - Backward compatibility support

## 🚀 Ready for Production

The frontend API service now has complete coverage of all Laravel API endpoints and is ready for production use. 