/**
 * AML1 (Advanced Markup Language 1) Core Engine
 * Open-Source Production Version 1.1.0
 * * This script intercepts the browser loading sequence, tokenizes raw text files,
 * builds an Abstract Syntax Tree (AST), and paints a modern custom user interface.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch the raw source code of the document running this script
    fetch(window.location.href)
        .then(response => response.text())
        .then(rawText => {
            // 2. Parse the code into elements
            const tokens = tokenizeAML(rawText);
            const ast = parseAML(tokens);

            // 3. Clear the default browser view and render the modern AML1 workspace
            renderAML(ast, document.documentElement);
        })
        .catch(err => {
            console.error("AML1 Core Engine Kernel Panic:", err);
        });
});

/**
 * Tokenizer / Lexer
 * Extracts tags and separate content blocks out of raw document strings.
 */
function tokenizeAML(rawText) {
    const tokens = [];
    const regex = /(<\/?[a-zA-Z1-9\-]+(?: [^>]+)?>)|([^<]+)/g;
    let match;

    while ((match = regex.exec(rawText)) !== null) {
        const [full, tag, text] = match;
        
        if (tag) {
            // Safely bypass both local and live remote GitHub bootloader tags
            if (tag.toLowerCase().includes('script') && tag.includes('language.js')) {
                continue; 
            }
            
            const isClosing = tag.startsWith('</');
            const name = tag.replace(/[<>\/]/g, '').split(' ')[0].toLowerCase();
            
            tokens.push({ 
                type: isClosing ? 'CLOSE_TAG' : 'OPEN_TAG', 
                name: name 
            });
        } else if (text && text.trim()) {
            tokens.push({ 
                type: 'TEXT', 
                value: text.trim() 
            });
        }
    }
    return tokens;
}

/**
 * Parser
 * Structures the linear array tokens into a nested parent/child tree hierarchy.
 */
function parseAML(tokens) {
    let root = { type: 'Root', children: [] };
    let currentParent = root;
    let stack = [root];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token.type === 'OPEN_TAG') {
            let node = { type: 'Element', name: token.name, children: [] };
            currentParent.children.push(node);
            stack.push(node);
            currentParent = node;
        } else if (token.type === 'CLOSE_TAG') {
            stack.pop();
            currentParent = stack[stack.length - 1] || root;
        } else if (token.type === 'TEXT') {
            currentParent.children.push({ 
                type: 'TextNode', 
                value: token.value 
            });
        }
    }
    return root;
}

/**
 * Modern High-Fidelity Rendering System
 * Maps AML1 components directly to styled elements with smooth layout geometry.
 */
function renderAML(node, targetContainer) {
    if (node.type === 'Root') {
        // Build the modern premium application wrapper environment
        targetContainer.innerHTML = ''; 
        targetContainer.style.backgroundColor = '#0b0f19'; // Deep Slate Blue background
        targetContainer.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        targetContainer.style.color = '#f1f5f9'; // High contrast white text
        targetContainer.style.padding = '50px 20px';
        targetContainer.style.minHeight = '100vh';
        targetContainer.style.boxSizing = 'border-box';
        targetContainer.style.display = 'flex';
        targetContainer.style.flexDirection = 'column';
        targetContainer.style.alignItems = 'center';
    }

    node.children?.forEach(child => {
        if (child.type === 'Element') {
            let element;
            
            switch(child.name) {
                case 'aml-title':
                    element = document.createElement('h1');
                    element.style.color = '#38bdf8'; // Electric blue heading
                    element.style.fontSize = '2.6rem';
                    element.style.fontWeight = '800';
                    element.style.letterSpacing = '-0.04em';
                    element.style.margin = '0 0 24px 0';
                    element.style.width = '100%';
                    element.style.maxWidth = '640px';
                    element.style.textAlign = 'center';
                    element.style.borderBottom = '2px solid #1e293b';
                    element.style.paddingBottom = '16px';
                    break;
                    
                case 'aml-box':
                    element = document.createElement('div');
                    element.style.background = '#1e293b'; // Glassmorphism-style card panels
                    element.style.border = '1px solid #334155';
                    element.style.padding = '24px';
                    element.style.borderRadius = '14px';
                    element.style.marginTop = '16px';
                    element.style.width = '100%';
                    element.style.maxWidth = '640px';
                    element.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)';
                    element.style.lineHeight = '1.6';
                    element.style.fontSize = '1.1rem';
                    element.style.boxSizing = 'border-box';
                    break;

                case 'aml-stat':
                    element = document.createElement('span');
                    element.style.background = 'linear-gradient(135deg, #38bdf8, #0ea5e9)'; // Vivid glowing blue badge
                    element.style.color = '#0b0f19';
                    element.style.fontWeight = '800';
                    element.style.fontSize = '0.8rem';
                    element.style.textTransform = 'uppercase';
                    element.style.letterSpacing = '0.06em';
                    element.style.padding = '4px 12px';
                    element.style.borderRadius = '6px';
                    element.style.marginRight = '12px';
                    element.style.display = 'inline-block';
                    element.style.verticalAlign = 'middle';
                    break;
                    
                default:
                    // Soft container behavior wrapper for unknown/unregistered tag trees
                    element = document.createElement('div');
                    element.style.width = '100%';
                    element.style.maxWidth = '640px';
                    element.style.marginTop = '12px';
                    element.style.fontSize = '1rem';
            }

            targetContainer.appendChild(element);
            renderAML(child, element); // Run recursive layout node parsing
        } else if (child.type === 'TextNode') {
            targetContainer.appendChild(document.createTextNode(child.value));
        }
    });
}
