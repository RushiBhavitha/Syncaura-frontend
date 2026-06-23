# Syncaura Frontend - API & Auth Architecture Guide

Hey team, Shivratna here. 

I've set up the base API and Auth integration architecture for our frontend. Please read through this guide before starting on your tasks so we keep our code clean, consistent, and avoid merge conflicts.

---

## 1. Folder Structure - Where things live

Here is where all our API and Auth files are located. Please make sure to follow this structure when adding new features:

* `src/config/axios.js` -> The main Axios client. It has request/response interceptors for automatic token handling and session refreshes.
* `src/redux/features/authThunks.js` -> Our API async calls (login, register, token refresh, password changes).
* `src/redux/slices/authSlice.js` -> Where we store the user state, auth tokens, and loading states in Redux.
* `src/services/errorHandler.js` -> Helper to process API error responses and show nicely styled toast alerts.
* `src/constant/validationRules.js` -> All form validation rules (Email format, required fields, etc.).
* `src/pages/SignIn.jsx` & `src/pages/SignUp.jsx` -> The main login and signup screens.

---

## 2. Authentication API Endpoints

These are the backend endpoints we are calling. The base URL is configured in `src/config/axios.js` (pointing to `http://localhost:5000/api` for local testing):

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in a user |
| POST | `/api/auth/logout` | Log out a user |
| POST | `/api/auth/refresh` | Refresh access token when it expires |
| GET | `/api/auth/me` | Fetch details of the logged-in user |

---

## 3. How Token Management & Interceptors Work

We use JWT tokens for security. There are two tokens we deal with:
* **Access Token**: Short-lived, stored in Redux state and mirrored in `localStorage` as `accessToken`.
* **Refresh Token**: Long-lived, stored in `localStorage` as `refreshToken`.

### Automatic Token Insertion (Request Interceptor)
You don't need to manually attach the Bearer token to every API header. The Axios client automatically reads it from `localStorage` and appends it to all requests:

```javascript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Auto-Token Refresh (Response Interceptor)
If an API request fails with a `401 Unauthorized` (access token expired), the Axios client will automatically pause any other outgoing requests, send a call to `/auth/refresh` to get a fresh access token, and then retry the original requests. 

If the refresh token itself has expired, the user will be logged out automatically and redirected to the login screen.

---

## 4. Request-to-Response Lifecycle

Here is the quick workflow of how data travels when a form is submitted:

1. **User clicks Submit**: The page runs the validation rules defined in `validationRules.js`.
2. **If validation passes**: The page dispatches an async thunk action (e.g., `loginUser(data)`).
3. **Thunk dispatches**: This sets the Redux loading state (`isLoading = true`) and triggers the Axios client.
4. **Axios request**: The request interceptor injects the access token and sends the payload to the Backend.
5. **Backend responds**: 
   * **Success**: The thunk updates the Redux slice (`authSlice`) with the new user info and tokens, and redirects the user to the correct page.
   * **Failure**: The error is captured and passed to `errorHandler.js`.
6. **Toast notification**: `errorHandler` reads the API error status and triggers a red/green toast popup.

---

## 5. Coding Best Practices (Important!)

### A. Dispatching Thunks
Always use `.unwrap()` when dispatching thunks from your forms so you can catch errors locally in a `try/catch` block. Example:

```javascript
const onSubmit = async (data) => {
  try {
    const res = await dispatch(loginUser(data)).unwrap();
    handleSuccess(`Welcome Back ${res?.user?.name || "User"}!`);
    navigate("/user-dashboard");
  } catch (err) {
    handleError(err || "Login failed");
  }
};
```

### B. Handle Loading States
To prevent users from clicking a button multiple times and triggering duplicate API calls, always check the loading states to disable the button:

```javascript
const { isLoading } = useSelector((state) => state.auth);
const { formState: { isSubmitting } } = useForm();

const isPending = isSubmitting || isLoading;

<button type="submit" disabled={isPending}>
  {isPending ? "Loading..." : "Sign In"}
</button>
```

### C. Styling Toast Alerts
When handling success/error popups, use the `handleSuccess` and `handleError` utilities from `errorHandler.js` instead of importing direct toast modules:

```javascript
import { handleError, handleSuccess } from "../services/errorHandler";

// Success:
handleSuccess("Changes saved successfully!");

// Error:
handleError("Something went wrong, please try again.");
```

Let me know if you run into any questions or conflicts while working on your tasks!
