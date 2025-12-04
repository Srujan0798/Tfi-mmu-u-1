
import React, { Component, ErrorInfo, ReactNode } from "react";

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
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-slate-950 text-slate-400 p-8 flex-col text-center">
          <span className="material-icons-round text-4xl mb-4 text-red-500">error_outline</span>
          <h1 className="text-xl font-bold text-slate-200 mb-2">Something went wrong</h1>
          <p className="text-sm text-slate-500 mb-6">Application encountered a runtime error.</p>
          <div className="bg-slate-900 p-4 rounded border border-slate-800 max-w-lg overflow-auto mb-6 text-left w-full">
            <code className="text-xs font-mono text-red-400 block whitespace-pre-wrap">
              {this.state.error?.toString() || "Unknown Error"}
            </code>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm font-bold shadow-lg shadow-blue-600/20"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
