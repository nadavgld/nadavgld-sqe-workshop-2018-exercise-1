import $ from 'jquery';
import { parseCode } from './code-analyzer';

var _html;
var _container = [];

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let line = 0;
        objectToTable(parsedCode, line)

        printTable()
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });

    function objectToTable(obj, line) {
        var body = obj.body

        if (body) {
            getBody(body, line + 1)
        }
    }

    function getBody(_body, line) {
        if(_body.type == "BlockStatement"){
            getBody(_body.body, line)
            
            return;
        }

        for (let index = 0; index < _body.length; index++) {
            const obj = _body[index];

            if (obj.type == "FunctionDeclaration") {
                _container.push({
                    line,
                    type: obj.id.type,
                    name: obj.id.name,
                    value: ''
                })

                if (obj.params.length > 0) {
                    obj.params.forEach(param => {
                        _container.push({
                            line,
                            type: 'Param',
                            name: param.name,
                            value: ''
                        })
                    })
                }
            } else if (obj.type == "BlockStatement") {

            } else if (obj.type == "VariableDeclaration") {
                obj.declarations.forEach(declare => {
                    _container.push({
                        line,
                        type: "VariableDeclarator",
                        name: declare.id.name,
                        value: declare.init || ''
                    })
                })
            } else if(obj.type == "ExpressionStatement"){
                
            }

            if (obj.body) {
                getBody(obj.body, line + 1)
            }
        }

    }

    function printTable() {
        _html = '';
        _container.forEach(obj => {
            obj.value = obj.value == undefined ? '' : obj.value
            _html += `<tr><td>${obj.line}</td><td>${obj.type}</td><td>${obj.name}</td><td>${obj.value}</td></tr>`
        })

        document.getElementById('outputTable').innerHTML = _html
    }
});
