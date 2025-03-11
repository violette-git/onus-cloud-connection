```mermaid
flowchart TD
    Start([User Visits Site]) --> LandingPage[Landing Page]
    
    %% Authentication Flow
    LandingPage --> SignIn{User Signed In?}
    SignIn -->|No| JoinNow[Click Join Now]
    SignIn -->|Yes| ExploreApp[Explore App]
    
    JoinNow --> SignUpFlow[Sign Up with Suno]
    SignUpFlow --> LinkSunoAccount[Link Suno Account Page]
    
    LinkSunoAccount --> InstallExtension[Install Suno Extension]
    InstallExtension --> GenerateLinkingCode[Generate Linking Code]
    GenerateLinkingCode --> OpenSunoProfile[Open Suno Profile]
    OpenSunoProfile --> EnterCodeInExtension[Enter Code in Extension]
    EnterCodeInExtension --> CodeVerification{Code Verified?}
    
    CodeVerification -->|Yes| PasswordDialog[Set Password Dialog]
    CodeVerification -->|No, Retry| GenerateLinkingCode
    
    PasswordDialog --> SetPassword[Set Password]
    SetPassword --> AccountLinked[Account Linked Successfully]
    AccountLinked --> RedirectToProfile[Redirect to Profile]
    
    %% Main Navigation
    ExploreApp --> NavOptions{Navigation Options}
    
    NavOptions --> NavExplore[Explore]
    NavOptions --> NavMusicians[Musicians]
    NavOptions --> NavConnections[Connections]
    NavOptions --> NavProfile[Profile]
    NavOptions --> NavMessages[Messages]
    NavOptions --> NavNotifications[Notifications]
    NavOptions --> NavSettings[Settings]
    
    %% Explore Page
    NavExplore --> ExplorePage[Explore Page]
    
    %% Musicians Flow
    NavMusicians --> MusiciansPage[Musicians Page]
    MusiciansPage --> SelectMusician[Select Musician]
    SelectMusician --> MusicianProfile[Musician Profile]
    
    %% Connections Flow
    NavConnections --> ConnectionsPage[Connections Page]
    
    %% Messages Flow
    NavMessages --> MessagesPage[Messages Page]
    MessagesPage --> SelectThread[Select Message Thread]
    SelectThread --> MessageThread[Message Thread]
    
    %% Profile Flow
    NavProfile --> ProfilePage[Profile Page]
    
    %% Notifications Flow
    NavNotifications --> NotificationsPage[Notifications Page]
    
    %% Settings Flow
    NavSettings --> SettingsPage[Settings Page]
    
    %% Comments Flow
    MusicianProfile --> ViewComments[View Comments]
    ViewComments --> CommentsPage[Comments Page]
    
    %% Sign Out Flow
    NavOptions --> SignOut[Sign Out]
    SignOut --> LandingPage
```
