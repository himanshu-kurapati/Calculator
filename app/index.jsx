import { View, Text } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native'
import CustomButton from '@/components/CustomButton'
import Row from '@/components/Row'
import TextDisplay from '@/components/TextDisplay'

export default function App() {

    const buttonGray = "bg-[#a6a6a6]";
    const textGray = "text-black ";
    const buttonOrange = "bg-[#f09a36]";
    const textOrange = "text-white ";
    const buttonBlack = "bg-[#333333]";
    const textBlack = "text-white ";

    const [text, setText] = useState('0');
    const [result, setResult] = useState(0);

    const handleButtonPress = useCallback((buttonTitle) => {
        const symbols = ['+', '-', 'x', '/', '%'];
        setText((prevText) => {
            if (buttonTitle === 'C') {
                return '0';
            } else if (buttonTitle === '+/-') {
                const match = prevText.match(/(\d+(\.\d+)?|\(-?\d+(\.\d+)?\))$/);
                if (match) {
                    const lastNumber = match[0];
                    const index = prevText.lastIndexOf(lastNumber);
                    let newNumber;

                    if (lastNumber.startsWith('(-')) {
                        // Case: Convert "(-13)" → "13"
                        newNumber = lastNumber.slice(2, -1);
                    } else if (lastNumber.startsWith('-')) {
                        // Case: Convert "-13" → "13"
                        newNumber = lastNumber.slice(1);
                    } else {
                        // Case: Convert "13" → "(-13)"
                        newNumber = `(-${lastNumber})`;
                    }

                    return prevText.slice(0, index) + newNumber;
                }
                return prevText;
            } else if (prevText === '0' && buttonTitle !== '.') {
                return buttonTitle;
            } else if (buttonTitle === '=') {
                if (prevText[prevText.length - 1] === '.' || symbols.includes(prevText[prevText.length - 1])) {
                    return prevText;
                }
                try {
                    const result = calculateResult(prevText);
                    return Number.isFinite(result) ? result.toString() : 'Error'
                } catch (error) {
                    return 'Error';
                }
            } else if (symbols.includes(prevText[prevText.length - 1]) && symbols.includes(buttonTitle)) {
                return prevText.slice(0, -1) + buttonTitle;
            } else {
                if (prevText.endsWith(')') && !symbols.includes(buttonTitle))
                    prevText += 'x';
                return prevText + buttonTitle;
            }
        });
    }, []);

    function calculateResult(expression) {
        // Replace 'x' with '*' for multiplication
        expression = expression.replace(/x/g, '*');

        // Define operator precedence
        const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2 };
        const isOperator = (char) => ['+', '-', '*', '/', '%'].includes(char);

        let outputQueue = [];
        let operatorStack = [];

        // Improved regex to correctly match negative and decimal numbers (e.g., "(-13.5)")
        let tokens = expression.match(/(\d+(\.\d+)?|\+|\-|\*|\/|\%|\(|\))/g);

        if (!tokens) throw new Error("Invalid expression");

        let processedTokens = [];
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === '-' && (i === 0 || isOperator(tokens[i - 1]) || tokens[i - 1] === '(')) {
                // Merge the negative sign with the next number
                processedTokens.push(tokens[i] + tokens[i + 1]);
                i++; // Skip the next number since it's already merged
            } else {
                processedTokens.push(tokens[i]);
            }
        }

        // Convert infix to postfix using the Shunting-yard algorithm
        processedTokens.forEach(token => {
            if (!isNaN(token)) {
                outputQueue.push(Number(token)); // If it's a number, add to output
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop(); // Pop '('
            } else if (isOperator(token)) {
                while (
                    operatorStack.length &&
                    precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
                ) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            }
        });

        while (operatorStack.length) {
            outputQueue.push(operatorStack.pop());
        }

        // Evaluate the postfix expression
        let stack = [];
        outputQueue.forEach(token => {
            if (!isNaN(token)) {
                stack.push(token);
            } else {
                let b = stack.pop();
                let a = stack.pop();
                switch (token) {
                    case '+': stack.push(a + b); break;
                    case '-': stack.push(a - b); break;
                    case '*': stack.push(a * b); break;
                    case '/': stack.push(a / b); break;
                    case '%': stack.push(a % b); break;
                }
            }
        });

        return stack.pop(); // The final result
    }


    return (
        <SafeAreaView className='w-full h-full bg-[#202020]'>
            <View className='w-full h-[30%] justify-end'>
                <TextDisplay displayText={text} />
            </View>
            <View className='px-6 h-[70%]'>
                <Row>
                    <CustomButton buttonStyle={buttonGray} textStyle={textGray}
                        title="C" handlePress={() => setText('0')}
                    />
                    <CustomButton buttonStyle={buttonGray} textStyle={textGray}
                        title="+/-" handlePress={() => handleButtonPress('+/-')}
                    />
                    <CustomButton buttonStyle={buttonGray} textStyle={textGray}
                        title="%" handlePress={() => handleButtonPress('%')}
                    />
                    <CustomButton buttonStyle={buttonOrange} textStyle={textOrange}
                        title="/" handlePress={() => handleButtonPress('/')}
                    />
                </Row>
                <Row>
                    <CustomButton buttonStyle={buttonBlack} textStyle={textBlack}
                        title="7" handlePress={() => handleButtonPress('7')}
                    />
                    <CustomButton buttonStyle={buttonBlack} textStyle={textBlack}
                        title="8" handlePress={() => handleButtonPress('8')}
                    />
                    <CustomButton buttonStyle={buttonBlack} textStyle={textBlack}
                        title="9" handlePress={() => handleButtonPress('9')}
                    />
                    <CustomButton buttonStyle={buttonOrange} textStyle={textOrange}
                        title="x" handlePress={() => handleButtonPress('x')}
                    />
                </Row>
                <Row>
                    <CustomButton buttonStyle={buttonBlack} textStyle={textBlack}
                        title="4" handlePress={() => handleButtonPress('4')}
                    />
                    <CustomButton buttonStyle={buttonBlack} textStyle={textBlack}
                        title="5" handlePress={() => handleButtonPress('5')}
                    />
                    <CustomButton buttonStyle={buttonBlack} textStyle={textBlack}
                        title="6" handlePress={() => handleButtonPress('6')}
                    />
                    <CustomButton buttonStyle={buttonOrange} textStyle={textOrange}
                        title="-" handlePress={() => handleButtonPress('-')}
                    />
                </Row>
                <Row>
                    <CustomButton buttonStyle={buttonBlack} textStyle={textBlack}
                        title="1" handlePress={() => handleButtonPress('1')}
                    />
                    <CustomButton buttonStyle={buttonBlack} textStyle={textBlack}
                        title="2" handlePress={() => handleButtonPress('2')}
                    />
                    <CustomButton buttonStyle={buttonBlack} textStyle={textBlack}
                        title="3" handlePress={() => handleButtonPress('3')}
                    />
                    <CustomButton buttonStyle={buttonOrange} textStyle={textOrange}
                        title="+" handlePress={() => handleButtonPress('+')}
                    />
                </Row>
                <Row>
                    <CustomButton buttonStyle={`${buttonBlack} w-[192]`} textStyle={textBlack}
                        title="0" handlePress={() => handleButtonPress('0')}
                    />
                    <CustomButton buttonStyle={buttonBlack} textStyle={textBlack}
                        title="." handlePress={() => handleButtonPress('.')}
                    />
                    <CustomButton buttonStyle={buttonOrange} textStyle={textOrange}
                        title="=" handlePress={() => handleButtonPress('=')}
                    />
                </Row>
            </View>

        </SafeAreaView>
    )
}