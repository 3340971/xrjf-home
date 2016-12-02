app.
controller('Home.Customer.index',
  [       '$scope', '$http', '$state', 'myUtils',
  function($scope ,  $http ,  $state ,  myUtils){
    $scope.authError = null;//错误提示
    $scope.pageInfo = {parameter:{}}; //查询条件绑定在分页信息的parameter属性下
    //列表查询,把$scope.pageInfo.parameter组装成查询字符串作为查询参数提交
    $scope.search = function(){
      $http.post(myUtils.U('Admin/User/index'), myUtils.http_build_query($scope.pageInfo.parameter))
      .then(function(response) {
        console.log(response);
        if ( !response.data.code ) {
          $scope.authError = response.data.data.msg;
        }else{
          $scope.list = response.data.data.list;  //console.log($scope.list);
          $scope.pageHTML = response.data.data.pageHTML;//分页HTML
          //因为是单页面应用,并且parameter已经和表单元素进行了双向数据绑定,所以不需要通过后台来获得
          //$scope.pageInfo = response.data.data.pageInfo;//分页信息
          // angular.forEach($scope.pageInfo.parameter,function(v,k){
          //   $scope.pageInfo.parameter[k] = decodeURIComponent(v);
          // });
        }
      },
      function(x) {
        $scope.authError = 'Server Error';
      });
    };
    $scope.search();
    //给分页按钮绑定事件
    var reg = /page=(\d+)/;
    document.addEventListener('click',function(e){
      e.stopPropagation();
      e.preventDefault();
      if(e.target.matches('.pagination a')){
        var p = reg.exec(e.target.getAttribute('href'))[1];
        $scope.pageInfo.parameter['page'] = p;
        $scope.search();
      }
    });
}]);


app
.controller('Home.Customer.edit',
  [       '$scope', '$http', '$state', 'myUtils',
  function($scope ,  $http ,  $state ,  myUtils){

}]);