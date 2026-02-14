# Dynamic Vanilla JavaScript Application Guide

A complete vanilla JavaScript framework for building dynamic, interactive web applications without external dependencies (except Tailwind CSS).

## 📁 Project Structure

```
frontend/client/scripts/
├── app.js           # Main application module
├── utils.js         # Utility functions
├── api.js           # API client module
├── modal.js         # Modal dialog system
├── toast.js         # Toast notifications
├── home.js          # Home page logic
└── program.js       # Program page logic

styles/
└── index.css        # Custom styles for animations and components
```

## 🚀 Core Modules

### 1. **App Module** (`app.js`)
Main application initialization and event handling.

```javascript
// Initialize app
App.init();

// Available features:
- Smooth scroll animations
- Parallax effects
- Scroll progress tracking
- Form handling
- Global event listeners
```

### 2. **Utils Module** (`utils.js`)
Helper functions for DOM manipulation and utilities.

```javascript
// DOM Manipulation
Utils.createElement(tag, className, html)
Utils.fadeIn(element, duration)
Utils.fadeOut(element, duration)
Utils.addClass(element, className, animate)
Utils.removeClass(element, className, animate)

// Selectors
Utils.$(selector)              // document.querySelector
Utils.$(selector)             // document.querySelectorAll

// Events
Utils.on(element, event, handler)
Utils.off(element, event, handler)
Utils.once(element, event, handler)

// Utilities
Utils.debounce(func, wait)
Utils.throttle(func, limit)
Utils.isValidEmail(email)
Utils.isValidPhone(phone)
Utils.formatDate(date)
Utils.formatTime(date)
```

### 3. **API Module** (`api.js`)
RESTful API client with automatic authentication.

```javascript
// Basic requests
API.get(endpoint)
API.post(endpoint, data)
API.put(endpoint, data)
API.patch(endpoint, data)
API.del(endpoint)

// File upload
API.upload(endpoint, file, fieldName, additionalData)

// Authentication
API.getToken()
API.setToken(token)

// Pre-built endpoints
API.programs.getAll()
API.programs.getById(id)
API.programs.create(data)
API.programs.update(id, data)
API.programs.delete(id)

API.users.getAll()
API.users.login(email, password)
API.users.register(data)
API.users.me()

API.events.getAll()
API.services.getAll()
API.metrics.getAll()
```

### 4. **Modal Module** (`modal.js`)
Dynamic modal dialogs and user confirmations.

```javascript
// Create and register modal
Modal.register(id, {
    title: 'Modal Title',
    content: '<p>Modal content</p>',
    buttons: [
        { text: 'Cancel', action: 'cancel', class: 'btn-secondary' },
        { text: 'OK', action: 'ok', class: 'btn-primary' }
    ]
});

// Open/Close
Modal.open(id)
Modal.close(id)
Modal.closeAll()
Modal.updateContent(id, data)

// Dialogs
Modal.confirm(title, message)  // Returns Promise<boolean>
Modal.alert(title, message)    // Returns Promise
```

### 5. **Toast Module** (`toast.js`)
Non-blocking notifications.

```javascript
// Show notifications
Toast.show(message, type, duration)
Toast.success(message, duration)
Toast.error(message, duration)
Toast.warning(message, duration)
Toast.info(message, duration)

// Close
Toast.close(id)
Toast.closeAll()
```

## 💡 Usage Examples

### Form Submission with Validation

```javascript
const form = document.querySelector('#my-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate
    if (!Utils.isValidEmail(data.email)) {
        Toast.error('Invalid email address');
        return;
    }
    
    // Submit
    const result = await API.post('/endpoint', data);
    
    if (result.success) {
        Toast.success('Form submitted successfully');
        form.reset();
    } else {
        Toast.error(result.error);
    }
});
```

### Dynamic Content Loading

```javascript
// Load programs dynamically
const loadPrograms = async () => {
    const result = await API.programs.getAll();
    
    if (result.success) {
        renderPrograms(result.data);
    } else {
        Toast.error('Failed to load programs');
    }
};

const renderPrograms = (programs) => {
    const container = Utils.$('[data-programs]');
    
    container.innerHTML = programs.map(program => `
        <div class="program-card">
            <h3>${program.title}</h3>
            <p>${program.description}</p>
        </div>
    `).join('');
};
```

### Modal with Form

```javascript
// Show enrollment modal
const showEnrollModal = (program) => {
    const content = `
        <form id="enroll-form">
            <input type="text" name="name" placeholder="Full Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <textarea name="message" placeholder="Message"></textarea>
        </form>
    `;
    
    Modal.register('enroll-modal', {
        title: `Enroll in ${program.title}`,
        content: content,
        buttons: [
            { text: 'Cancel', action: 'cancel' },
            { text: 'Enroll', action: 'enroll' }
        ]
    });
    
    Modal.open('enroll-modal');
};
```

### API Error Handling

```javascript
// Automatic 401 handling
const result = await API.get('/protected-endpoint');

if (result.success) {
    // Handle success
} else if (result.status === 401) {
    // Automatically redirected to login
} else {
    Toast.error(result.error);
}
```

## 🎨 Styling Features

### Animations
- **Scroll Progress Bar** - Visual indicator of page scroll position
- **Parallax Effect** - Depth effect on header video
- **Fade Transitions** - Smooth element visibility changes
- **Slide Animations** - Directional scroll animations

### Modal Styles
- Overlay backdrop
- Smooth slide-up entrance
- Responsive sizing
- Custom button styling

### Toast Notifications
- Type-based colors (success, error, warning, info)
- Auto-dismiss with custom duration
- Stacked layout
- Close button

## 🔧 Configuration

Edit `App.config` for default settings:

```javascript
App.config = {
    apiBase: 'http://localhost:8000',
    animationDuration: 300,
    toastDuration: 3000
};
```

## 📱 Responsive Design

All components are mobile-responsive:
- Modals resize for small screens
- Toast notifications adapt to viewport width
- Touch-friendly button sizes

## ⚡ Performance Optimization

- Debounced scroll events using `requestAnimationFrame`
- Efficient DOM queries with caching
- Minimal reflows and repaints
- Event delegation where applicable
- Lazy loading support in API module

## 🛡️ Security Features

- XSS protection through textContent
- CSRF token support (via Authorization header)
- Input validation utilities
- Secure API token storage
- Automatic logout on 401

## 🐛 Debugging

Enable console logging:

```javascript
// All modules log to console with 🚀 emoji prefix
// Check browser console for detailed logs
```

## 📚 Migration from jQuery

**Before (jQuery):**
```javascript
$('#modal').fadeIn();
$.post('/api/data', data, callback);
```

**After (Vanilla JS):**
```javascript
Modal.open('modal-id');
await API.post('/api/data', data);
```

## 🎯 Best Practices

1. **Always check API response success flag**
   ```javascript
   if (result.success) { /* use result.data */ }
   ```

2. **Use data attributes for configuration**
   ```html
   <button data-action="enroll" data-program="123">Enroll</button>
   ```

3. **Handle promises properly**
   ```javascript
   const result = await API.get('/endpoint');
   ```

4. **Clean up event listeners**
   ```javascript
   Utils.off(element, 'click', handler);
   ```

5. **Validate user input before sending**
   ```javascript
   if (form.checkValidity()) { /* submit */ }
   ```

## 🚀 Getting Started

1. Include scripts in HTML (in order):
   ```html
   <script src="utils.js"></script>
   <script src="api.js"></script>
   <script src="modal.js"></script>
   <script src="toast.js"></script>
   <script src="app.js"></script>
   <script src="page-specific.js"></script>
   ```

2. Initialize when DOM is ready:
   ```javascript
   document.addEventListener('DOMContentLoaded', () => {
       App.init();
   });
   ```

3. Start using the modules in your code!

## 📖 Full API Reference

See individual module comments in source files for comprehensive documentation.

---

Built with vanilla JavaScript for maximum compatibility and minimal dependencies.
