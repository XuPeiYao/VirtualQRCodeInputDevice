class Extension {
    static convertStringToNode(HTML) {
        return Extension.convertStringToNodes(HTML)[0];
    }
    static convertStringToNodes(HTML) {
        var temp = document.createElement('div');
        temp.innerHTML = HTML;
        var result = new Array();
        for (var i = 0; i < temp.childNodes.length; i++) {
            result.push(temp.childNodes.item(i));
        }
        return result;
    }
    static createGUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}
//# sourceMappingURL=extensions.js.map