# Project Overview  

You're building a "Swifty Companion" mobile app using React Native and Expo with TypeScript that will:

- Connect to the 42 API to retrieve and display student information
- Implement OAuth2 authentication properly

## Mandatory Requirements

1. At least 2 views/screens in the app
2. Handle all error cases (login not found, network errors, etc.)
3. First view: Search/login screen
4. Second view: Display student information including:
    - At least 4 user details (login, email, mobile, level, location, wallet, evaluations)
    - Profile picture
    - Skills with level and percentage
    - Completed projects (including failed ones)

5. Navigation to return to the first view
6. Use flexible/modern layout techniques for different screen sizes
7. Implement OAuth2 correctly without creating a token for each query

## Bonus Requirements

- Automatically refresh the OAuth token when it expires while maintaining app functionality

### Critical Security Note

- API keys, credentials, and environment variables must be stored in a local .env file that's excluded from git

----

### View1: Login Screen

- Project logo with "Continue with intra" button featuring the 42 logo

### View2: Profile View

- Displays the logged-in user's data with a logout button

### View3: Search View

- Input field to search for students by username, with results leading to a profile displays

### View4: Profile Display View

- Similar layout to the Profile View but for displaying other students' data

## More optional features

1- Dark/Light Mode Toggle: Implement theme switching to demonstrate state management and styling skills  
2- Pull-to-Refresh: Add the ability to refresh profile data with a pull gesture  
3- Project Timeline: Create a visual timeline of the user's project history  
4- Coalition Badge/Theme: Display coalition information and maybe theme parts of the UI based on the user's coalition  
5- Achievement Showcase: Highlight special achievements or badges  
6- Offline Caching: Cache previously viewed profiles for offline viewing  
7- Search History: Save recent searches for quick access  
8- Campus Map Integration: If location data is available, show where a student typically works  

## Authentication Flow

I'll use the OAuth2 Web Application flow as described in the API documentation:

1- Redirect users to <https://api.intra.42.fr/oauth/authorize> with your client_id, redirect_uri, etc.  
2- Handle the redirect back to your app with the authorization code  
3- Exchange the code for an access token by making a POST request to <https://api.intra.42.fr/oauth/token>  
4- Use the token for subsequent API requests with the Authorization header  

## Key Features Implementation

### Authentication

Use React Native's WebView or expo-auth-session to handle the OAuth flow
Store tokens securely using expo-secure-store
Implement token refresh logic when it expires

### API Service

Create functions to fetch user profiles, skills, projects  
Handle error cases (network issues, login not found, etc.)  
Implement proper pagination for listing data  

### Screens

- Login Screen: Display project logo and "Continue with intra" button
- Profile Screen: Show logged-in user data with logout button
- Search Screen: Input to search for students, results display in a list
- Profile Detail Screen: Display selected student profile details
Profile Detail Screen: Display selected student profile details

### Navigation

- Use React Navigation for handling screen transitions
- Set up protected routes that require authentication

## Resources

- [42 API Documentation](https://api.intra.42.fr/apidoc/guides/getting_started)
- [42 Web Application Flow](https://api.intra.42.fr/apidoc/guides/web_application_flow)
- [42 Users API](https://api.intra.42.fr/apidoc/endpoints/users)
