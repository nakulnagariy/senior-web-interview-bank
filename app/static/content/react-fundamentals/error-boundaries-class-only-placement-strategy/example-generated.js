// Class error boundary
import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // Log error or send to monitoring service
  }
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

// Placement: Global
// <ErrorBoundary><App /></ErrorBoundary>

// Placement: Local
// <ErrorBoundary><Widget /></ErrorBoundary>