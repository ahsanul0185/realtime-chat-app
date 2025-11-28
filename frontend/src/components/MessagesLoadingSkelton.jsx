import React from 'react';

const MessagesLoadingSkelton = () => {
  // Different widths for more realistic chat bubbles
  const bubbleWidths = ['w-32', 'w-48', 'w-40', 'w-56', 'w-36', 'w-44'];
  
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => {
        const isReceived = index % 2 === 0;
        
        return (
          <div
            key={index}
            className={`flex ${isReceived ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`flex items-end gap-2.5 px-4 py-2 rounded-full max-w-1/2 animate-pulse ${
                bubbleWidths[index % bubbleWidths.length]
              } ${
                isReceived
                  ? 'bg-gray-700/50 border border-gray-600/30'
                  : 'bg-gray-600/50'
              }`}
            >
              {/* Single line skeleton */}
              <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesLoadingSkelton;