import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import App from './components/App'
import './index.css'
import reducers from './reducers'


// If you have a rootReducer file, import it
// import rootReducer from './reducers'

// Create store with modern Redux Toolkit
const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== 'production',
})

// Add error boundary
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

// Add error logging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})
