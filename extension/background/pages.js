(function(){
    GLOBALS.pagesProm=getPages();

    function getPages(){
      return Promise.resolve($.get('http://127.0.0.1:1337/api/user/page')).then(null,function(){
        return [];
      });
    }
})();