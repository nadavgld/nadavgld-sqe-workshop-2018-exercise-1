import assert from 'assert';
import parser from '../src/js/parser.js'

describe('Check parser functionallity', () => {
    it('Function declaration type', () => {
        var obj = {
            "type": "FunctionDeclaration",
            "id": {
                "type": "Identifier",
                "name": "binarySearch"
            },
            "params": [
                {
                    "type": "Identifier",
                    "name": "X"
                },
                {
                    "type": "Identifier",
                    "name": "V"
                },
                {
                    "type": "Identifier",
                    "name": "n"
                }
            ],
            "body": {
                "type": "BlockStatement",
                "body": []
            },
            "generator": false,
            "expression": false,
            "async": false
        }

        assert.equal(
            parser.handleFuncDec(obj).type,
            'function declaration'
        );
    });

    it('Params parsing', () => {
        var obj =
        {
            "type": "Identifier",
            "name": "X"
        }

        assert.equal(
            parser.handleParams(obj).name,
            obj.name
        );
    });

    it('Var declaration', () => {
        var obj = {
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "a"
                    },
                    "init": {
                        "type": "Literal",
                        "value": 1,
                        "raw": "1"
                    }
                }
            ],
            "kind": "let"
        }

        assert.equal(
            parser.handleVarDec(obj).value.toString(),
            '1'
        )
    })

    it('While condition', () => {
        var obj = {
            "type": "WhileStatement",
            "test": {
                "type": "BinaryExpression",
                "operator": ">",
                "left": {
                    "type": "Identifier",
                    "name": "x"
                },
                "right": {
                    "type": "Literal",
                    "value": 2,
                    "raw": "2"
                }
            },
            "body": {
                "type": "EmptyStatement"
            }
        }

        assert.equal(
            parser.handleLoops(obj).condition,
            'x > 2'
        )
    })

    it('if consequent', () => {
        var obj = {
            "type": "IfStatement",
            "test": {
                "type": "BinaryExpression",
                "operator": ">",
                "left": {
                    "type": "Identifier",
                    "name": "x"
                },
                "right": {
                    "type": "Literal",
                    "value": 2,
                    "raw": "2"
                }
            },
            "consequent": {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "console"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "log"
                        }
                    },
                    "arguments": [
                        {
                            "type": "Identifier",
                            "name": "x"
                        }
                    ]
                }
            },
            "alternate": null
        }

        console.log(parser.handleConsequent(obj));

        // assert.equal(
        //     '1',
        //     '1'
        // )
    })
});
