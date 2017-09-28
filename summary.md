#Imooc imatate practice summary
##总结  


- 这次模仿Imooc首页制作持续了一个多月，主要是这半个月在进行N301项目的开发，导致这个写的有点慢。但是总的来说收获还是很丰富的。
- 相比第一次进行仿写页面功能齐全了许多，之前很多东西不知道怎么实现，这次能看到的交互全部实现了。基础的排版错误减少了。在写Imooc首页的时候查阅了很多的资料，学习了很多各方面的知识。从html、css、js方面分开总结如下

### HTML


- html方面主要是学习了H5的一些标签和属性的运用，因为要兼容IE8，所以采用的比较少，然后兼容是使用h5shiv.js这个库来实现的。稍微了解了一下h5shiv的工作机制：参考连接 [https://www.xxling.com/blog/article/41.aspx](https://www.xxling.com/blog/article/41.aspx)  
源码链接 [https://github.com/aFarkas/html5shiv/blob/master/src/html5shiv.js](https://github.com/aFarkas/html5shiv/blob/master/src/html5shiv.js)    
源码注释非常的多（和代码量差不多，源码总共才300行，空行和注释大概有一大半），写的逻辑也很清晰，这种代码风格可以学习一下。
  
1.首先是如何检测浏览器是否支持HTML5标签的样式，通过创建一个标签，然后检测标签中是否有html5的新属性（源码用的是a标签的hidden属性）("hidden" in a)若为true则说明支持，否则不支持。  
2.然后是如何检测浏览器是否支持Html5标签，通过向刚才创建的a标签里添加一个自定义子标签，通过a.childNodes.length来判断  IE8及以下返回为0，其余为1
3.最后通过对document.creatDocumentFragement方法中的三个属性cloneNode createDocumentFragment createElement 来判断是否支持html5标签。  

- 检测完毕后 如果不支持html5标签样式则向&lt;head&gt;标签里添加H5的css样式。如下图所示，可以看到IE8里head里被插入了一个样式表。![](/1.png)
![](/2.png)

- 如果不支持html5标签则通过document.creatElement来一一创建一次h5的标签。只要在document里创建过一次对象后，后续的样式就能正常的应用在h5标签上了。然后将他们都append到documentFragment里面，因为documentFragment是一个虚拟的类似于缓存的地方，不将其append到页面上就不会显示，而且documentFragment属于document对象，所以可以在页面不添加多余标签的情况下创建标签。然后后续的标签就可以成功应用样式了。
- 知识点1 documentFragment，在平时经常会遇到循环里往某个节点一直添加新的节点的情况 e.g:    
	for(var i = 0;i < 10;i++){  
	  var node = document.creatElement("&lt;a&gt;&lt;/a&gt;");
	  document.body.append(node);  
	}
这样的情况下每次append都会引起整个页面的回流，消耗性能巨大。改写成如下情况。
	var d = document.createDocumentFragment();  
	for(var i = 0;i < 10;i++){  
	  var node = document.creatElement("&lt;a&gt;&lt;/a&gt;");
	  d.append(node);  
	}  
	document.body.append(d);  
这样写则只会引起一次回流，就是append(d)的时候。可以把documentFragement理解成在document里的缓存碎片节点。
-知识点2 Function()与eval()  
Function是类实例的封装对象，类似于String之于string。  
Function()可以通过 Function(arg1,arg2,...,argn,执行体);的结构构造一个函数，其中执行体为字符串，执行方式同eval，但是性能会比eval高很多
