// Class component lifecycle methods
import React from 'react';

class ExampleClass extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  handleResize = () => {
    // handle resize logic
  }
  render() {
    return <div>Class Example</div>;
  }
}

// Equivalent with hooks
import React, { useEffect } from 'react';

function ExampleHook() {
  useEffect(() => {
    function handleResize() {
      // handle resize logic
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <div>Hook Example</div>;
}