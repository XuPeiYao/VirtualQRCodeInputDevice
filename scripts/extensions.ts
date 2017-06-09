class Extension {//擴充功能靜態物件
    public static convertStringToNode(HTML: string): Node {
        return Extension.convertStringToNodes(HTML)[0];
    }
    public static convertStringToNodes(HTML: string): Node[] {
        var temp = document.createElement('div');
        temp.innerHTML = HTML;

        var result: Node[] = new Array<Node>();
        for (var i = 0; i < temp.childNodes.length; i++) {
            result.push(temp.childNodes.item(i));
        }
        return result;
    }
    public static createGUID(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}