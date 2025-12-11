# Sub-Class Diagrams for TrailsExplorer

Do sơ đồ tổng thể quá lớn, dưới đây là các sơ đồ con được chia theo phân hệ chức năng để dễ dàng quan sát và chèn vào tài liệu.

## 1. User & Community Module
Tập trung vào các tính năng xã hội, nhóm, hồ sơ người dùng và chợ đồ phượt.

```mermaid
classDiagram
    direction LR
    
    namespace Components {
        class Profile {
            <<Component>>
            +onSelectTrail()
        }
        class SocialFeed {
            <<Component>>
            +showUserFeed()
        }
        class GroupView {
            <<Component>>
            +handleSendMessage()
        }
        class Marketplace {
            <<Component>>
            +listItems()
        }
    }

    namespace Services {
        class JournalGeneratorService {
            <<Service>>
            +createVideoSummary()
            +generateStoryFromLogs()
        }
    }

    namespace Models {
        class User {
            +string id
            +string name
            +Role role
        }
        class Group {
            +number id
            +string name
        }
        class ChatMessage {
            +number id
            +string text
        }
        class MarketplaceItem {
            +string id
            +number price
        }
        class CommunityChallenge {
            +string id
            +number goal
        }
    }

    %% Relationships
    Profile o-- User
    SocialFeed o-- CommunityChallenge
    SocialFeed ..> JournalGeneratorService
    GroupView o-- Group
    Group *-- ChatMessage
    Marketplace o-- MarketplaceItem
    User -- MarketplaceItem : sells
    User o-- Group : member
```

## 2. Trekking & Planning Module
Tập trung vào việc lập kế hoạch, tối ưu lộ trình và xem chi tiết cung đường.

```mermaid
classDiagram
    direction LR

    namespace Components {
        class Planner {
            <<Component>>
            +createGroupPlan()
        }
        class TrailDetail {
            <<Component>>
            +onToggleFavorite()
        }
    }

    namespace Services {
        class GeminiService {
            <<Service>>
            +generateTrekkingPlan()
            +generateChecklist()
        }
        class RouteOptimizerService {
            <<Service>>
            +optimizeRoute()
        }
    }

    namespace Models {
        class Trail {
            +string id
            +string name
            +string difficulty
        }
        class ItineraryPlan {
            +ItineraryDay[] plan
        }
        class ItineraryDay {
            +number day
            +string route
        }
        class Review {
            +string username
            +number rating
        }
    }

    %% Relationships
    Planner ..> GeminiService
    Planner ..> RouteOptimizerService
    Planner ..> ItineraryPlan : creates
    ItineraryPlan *-- ItineraryDay
    TrailDetail o-- Trail
    Trail *-- Review
```

## 3. Map & Safety Module
Tập trung vào bản đồ, định vị, cảnh báo an toàn và ghi nhật ký giọng nói.

```mermaid
classDiagram
    direction LR

    namespace Components {
        class MapView {
            <<Component>>
            +toggle3DMode()
            +showHeatmap()
        }
        class VoiceRecorder {
            <<Component>>
            +startRecording()
        }
    }

    namespace Services {
        class OfflineMapService {
            <<Service>>
            +downloadRegion()
            +syncDataWhenOnline()
        }
        class SafetyService {
            <<Service>>
            +trackMemberLocation()
            +sendSOSAlert()
        }
        class NotificationService {
            <<Service>>
            +sendWeatherAlert()
        }
    }

    namespace Models {
        class VoiceLog {
            +string id
            +string audioUrl
        }
        class User {
            +string id
            +Location currentLocation
        }
    }

    %% Relationships
    MapView ..> OfflineMapService
    MapView ..> SafetyService
    MapView ..> NotificationService
    VoiceRecorder ..> VoiceLog : creates
    SafetyService ..> User : tracks
```

## 4. Admin & Content Management Module
Tập trung vào các tính năng quản trị, kiểm duyệt nội dung và sách hướng dẫn.

```mermaid
classDiagram
    direction LR

    namespace Components {
        class AdminDashboard {
            <<Component>>
            +manageUsers()
            +approveContent()
        }
        class Guidebook {
            <<Component>>
            +showArticles()
        }
    }

    namespace Services {
        class AdminService {
            <<Service>>
            +approveTrail()
            +deleteContent()
            +banUser()
        }
    }

    namespace Models {
        class User {
            +string id
            +Role role
        }
        class Contribution {
            +string id
            +string status
        }
        class GuidebookArticle {
            +string id
            +string title
        }
        class Trail {
            +string id
            +boolean isVerified
        }
    }

    %% Relationships
    AdminDashboard ..> AdminService
    AdminService ..> User : manages
    AdminService ..> Contribution : approves/rejects
    AdminService ..> Trail : verifies
    Guidebook o-- GuidebookArticle
    User -- Contribution : submits
```
