/**
 * Input Validation for BDO Enhancement Calculator
 * Prevents negative numbers in failstack inputs
 */

document.addEventListener('DOMContentLoaded', function() {
    // Function to handle input event on number fields
    function preventNegativeNumbers(e) {
        // Get the current value
        const value = parseInt(e.target.value);
        
        // If it's negative, reset to 0
        if (value < 0) {
            e.target.value = 0;
        }
    }
    
    // Apply to all existing number inputs
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        // Set minimum value
        if (!input.hasAttribute('min')) {
            input.setAttribute('min', '0');
        }
        
        // Add input event listener
        input.addEventListener('input', preventNegativeNumbers);
    });
    
    // Create a mutation observer to watch for dynamically created inputs
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check each added node
            mutation.addedNodes.forEach(function(node) {
                // If it's an element node
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if it's an input with type="number"
                    if (node.nodeName === 'INPUT' && node.getAttribute('type') === 'number') {
                        // Set min attribute if not already set
                        if (!node.hasAttribute('min')) {
                            node.setAttribute('min', '0');
                        }
                        
                        // Add input event listener
                        node.addEventListener('input', preventNegativeNumbers);
                    }
                    
                    // Also check child nodes
                    const numberInputs = node.querySelectorAll('input[type="number"]');
                    numberInputs.forEach(input => {
                        // Set minimum value
                        if (!input.hasAttribute('min')) {
                            input.setAttribute('min', '0');
                        }
                        
                        // Add input event listener
                        input.addEventListener('input', preventNegativeNumbers);
                    });
                }
            });
        });
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
    
    console.log('Input validation initialized - preventing negative numbers in failstack inputs');
});
