var _html;
var _container = [];
let line = 0;

const TYPES = {
    FunctionDeclaration: 'function declaration',
    VariableDeclaration: 'variable declaration',
    AssignmentExpression: 'assignment expression',
    WhileStatement: 'while statement',
    ForStatement: 'for statement',
    IfStatement: 'if statement',
    ElseStatement: 'else if statement',
    CallExpression: 'call expression',
    ReturnStatement: 'return statement'
}

function objectToTable(obj) {
    var body = obj.body

    if (body) {
        // line++;
        getBody(body)
    }
}

function handleFuncDec(obj) {
    var _newLine = {
        line,
        type: TYPES[obj.type],
        name: obj.id.name,
        condition: '',
        value: ''
    }

    _container.push(_newLine)

    if (obj.params.length > 0) {
        obj.params.forEach(param => {
            handleParams(param)
        })
    }

    return _newLine
}

function handleParams(param) {  
    var _newLine = {
        line,
        type: 'variable declaration',
        name: param.name,
        condition: '',
        value: ''
    }
    
    _container.push(_newLine)

    return _newLine
}

function handleVarDec(obj) {
    var _newLine;
    obj.declarations.forEach(declare => {
        _newLine = {
            line,
            type: TYPES[obj.type],
            name: declare.id.name,
            condition: '',
            value: declare.init ? declare.init.value || declare.init.name : ''
        }

        _container.push(_newLine)
    })

    return _newLine
}

function handleConsequent(obj){
    return getBody([obj.consequent])
}

function handleAlternate(obj){
    var _obj = JSON.parse(JSON.stringify(obj.alternate))

    _obj.type = _obj.type == "IfStatement" ? 'ElseStatement' : _obj.type

    if (_obj.type != "ElseStatement") {
        _container.push({
            line: line + 1,
            type: 'else statement',
            name: '',
            value: '',
            condition: ''
        })
    }
    // line++;
    return getBody([_obj])
}

function handleLoops(obj) {
    const _TEST = obj.test

    var _newObj = {
        line,
        type: TYPES[obj.type],
        name: '',
        value: ''
    }

    var _cond = ''

    if (_TEST) {
        _cond = recursiveChilds(_TEST).toString()
        _cond = _cond.startsWith('(') ? _cond.substring(1).substring(0, _cond.length - 2).trim() : _cond

        _newObj.condition = _cond
        _container.push(_newObj)
    }

    if (obj.type == "IfStatement" || obj.type == "ElseStatement") {
        if (obj.consequent) {
            // line++
            handleConsequent(obj)
        }

        if (obj.alternate) {
            handleAlternate(obj)
        }
    }

    return _newObj
}

function handleExpression(obj) {
    const _EXPRESSION = obj.expression

    var _newObj = {
        line,
        type: TYPES[_EXPRESSION.type],
        condition: ''
    }

    if (_EXPRESSION.operator == "=") {
        _newObj.name = _EXPRESSION.left.name || _EXPRESSION.left.value
        var _value = ''

        if (_EXPRESSION.right) {
            _value = recursiveChilds(_EXPRESSION.right).toString()
            _value = _value.startsWith('(') ? _value.substring(1).substring(0, _value.length - 2).trim() : _value

            _newObj.value = _value
            _container.push(_newObj)
        }
    }else if(_EXPRESSION.callee){
        var _value = recursiveChilds(_EXPRESSION.callee).toString()
        _value = _value.startsWith('(') ? _value.substring(1).substring(0, _value.length - 2).trim() : _value

        _newObj.name = _value
        _newObj.value = ''
    
        _container.push(_newObj)
    }

    return _newObj
}

function handleReturn(obj) {
    var _newObj = {
        line,
        type: TYPES[obj.type],
        name: '',
        condition: ''
    }

    var _val = recursiveChilds(obj.argument).toString()
    _val = _val.startsWith('(') ? _val.substring(1).substring(0, _val.length - 2).trim() : _val

    _newObj.value = _val
    _container.push(_newObj)
}

function getBody(_body) {
    if (_body.type == "BlockStatement") {
        getBody(_body.body)

        return;
    }

    for (let index = 0; index < _body.length; index++) {
        line++;
        const obj = _body[index];

        if (obj.type == "FunctionDeclaration") {
            handleFuncDec(obj)
        } else if (obj.type == "BlockStatement") {
            //continue
        } else if (obj.type == "VariableDeclaration") {
            handleVarDec(obj)
        } else if (obj.type == "ExpressionStatement") {
            handleExpression(obj)
        } else if (obj.type == "WhileStatement" || obj.type == "IfStatement" || obj.type == "ElseStatement") {
            handleLoops(obj)
        } else if (obj.type == "ReturnStatement") {
            handleReturn(obj)
        }

        if (obj.body) {
            // line++
            getBody(obj.body)
        }

        // line++;
    }

}

function recursiveChilds(obj) {
    if (obj.type == "BinaryExpression") {
        var operator = obj.operator;
        if (obj.left && obj.right) {
            return `(  ${recursiveChilds(obj.left)} ${operator} ${recursiveChilds(obj.right)} )`
        }
    } else if (obj.type == "Literal") {
        return obj.value
    } else if (obj.type == "Identifier") {
        return obj.name
    } else if (obj.type == "MemberExpression") {
        if(obj.computed){
            var prop = obj.property.type == "Literal" ? obj.property.value : obj.property.name
            return '' + obj.object.name + '[' + prop + ']'
        }else{
            var prop = obj.property ? obj.object.name + "." + obj.property.name : obj.object.name
            return prop
        }
    } else if (obj.type == "UnaryExpression") {
        var prop = obj.argument.type == "Literal" ? obj.argument.value : obj.argument.name

        return '' + obj.operator + prop
    }
}

function printTable() {
    _html = '';
    _container.forEach(obj => {
        obj.value = obj.value == undefined ? '' : obj.value
        _html += `<tr><td>${obj.line}</td><td>${obj.type}</td><td>${obj.name}</td><td>${obj.condition}</td><td>${obj.value}</td></tr>`
    })

    document.getElementById('sol').style.display = 'table';
    document.getElementById('outputTable').innerHTML = _html
}

function clearTable() {
    _container = [];
    line = 0;

    printTable()
}

module.exports = {
    _html,
    _container,
    line,
    TYPES,
    objectToTable,
    getBody,
    recursiveChilds,
    printTable,
    clearTable,
    handleExpression,
    handleFuncDec,
    handleLoops,
    handleReturn,
    handleVarDec,
    handleParams,
    handleAlternate,
    handleConsequent
}