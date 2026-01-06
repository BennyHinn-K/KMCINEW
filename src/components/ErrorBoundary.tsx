import { Component, ErrorInfo, ReactNode } from 'react';
import { Logger } from '../lib/logger';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidMount() {
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.addEventListener('error', this.handleWindowError);
  }

  public componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.removeEventListener('error', this.handleWindowError);
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    Logger.error('Unhandled Promise Rejection', { reason: event.reason });
    // Optional: Update state to show error UI if critical
    // this.setState({ hasError: true, error: new Error(String(event.reason)) });
  };

  private handleWindowError = (event: ErrorEvent) => {
    Logger.error('Global Window Error', { message: event.message, filename: event.filename, lineno: event.lineno });
  };

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Logger.error('Dashboard Component Error', { error: error.message, stack: errorInfo.componentStack });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleCopyError = () => {
    if (this.state.error) {
      navigator.clipboard.writeText(this.state.error.toString());
      alert('Error details copied to clipboard');
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">System Error Detected</h2>
            <p className="text-gray-600 mb-6">
              The system has intercepted a critical error. Diagnostics have been logged.
            </p>
            {this.state.error && (
              <div className="bg-gray-100 p-3 rounded text-left text-xs font-mono text-gray-700 mb-6 overflow-auto max-h-32 border border-gray-200">
                {this.state.error.toString()}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Recover System
              </button>
              <button
                onClick={this.handleCopyError}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Copy Log
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
