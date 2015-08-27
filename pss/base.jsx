#target photoshop
var sliceLayerSet = activeDocument.layerSets.getByName("slice");
var itemLayerSet = sliceLayerSet.layerSets;
var itemCount = itemLayerSet.length;
var cssText = '';
var consoleText = '';
var fromDoc = app.activeDocument;
var fromLayer = app.activeDocument.artLayers.getByName("jpg");
var picSaveFirst = true;
var curPath = '~/Desktop/';
var saveFolder = curPath;
function init(){
    getCurPath();
    setSaveFolder();
    for(var i = 0; i < itemCount; i++){ 
    cssText += objCss('.' + itemLayerSet[i].name,itemLayerSet[i].bounds,[],0)
    if(itemLayerSet[i].layerSets){
        //这还是个组
        for(var j = 0;j< itemLayerSet[i].artLayers.length; j++){
            if(itemLayerSet[i].artLayers[j].name == 'item'){
                
                }
            else{
            var tClassName = '.' + itemLayerSet[i].name + ' .' + itemLayerSet[i].artLayers[j].name;
                    cssText += objCss(tClassName,itemLayerSet[i].artLayers[j].bounds,itemLayerSet[i].bounds,1)
                    }
                    if(itemLayerSet[i].artLayers[j].name == 'pic'){
                        cropNewFile(itemLayerSet[i].artLayers[j].bounds,'jpg',itemLayerSet[i].name,fromDoc)
                        //todo：把传入的jpg、slice改成可配置
                        }
            }
        }
    else{
        //读取图层信息
        }   
}; 
    saveTxt(cssText,'css');
    }
init();

function getCurPath(){
    curPath = app.activeDocument.path;
    }
function setSaveFolder(){
    saveFolder = new Folder(curPath + '/tmp');
    saveFolder.create();
    }

//alert(app.preferences.showSliceNumber)
//todo:可更改后缀
function saveTxt(txt,filename)
{
    var Name = filename;//app.activeDocument.name.replace(/\.[^\.]+$/, '');
    var Ext = decodeURI(app.activeDocument.name).replace(/^.*\./,'');
    if (Ext.toLowerCase() != 'psd')
        return;
    var saveFile = File(curPath + "/" + Name +".txt");

    if(saveFile.exists)
        saveFile.remove();

    saveFile.encoding = "UTF8";
    saveFile.open("e", "TEXT", "????");
    saveFile.writeln(txt);
    saveFile.close();
}
//返回对象css，输入：class名、bounds数组，输出：css
function objCss(_className,_bounds,_parentBounds,_type){
    var tWidth = parseInt(_bounds[2])-parseInt(_bounds[0])
    var tHeight = parseInt(_bounds[3])-parseInt(_bounds[1])
    var tTop = parseInt(_bounds[1])
    var tLeft = parseInt(_bounds[0])
    if(_parentBounds.length > 2){       
        var tTopParent = parseInt(_parentBounds[1])
        var tLeftParent = parseInt(_parentBounds[0])
        }
    if(_type == 0){
        //直接输出css
        
        }
    else if(_type == 1){
        //需要处理相对父级定位
        tTop = tTop - tTopParent;
        tLeft = tLeft - tLeftParent;
        }
    if(_className.indexOf('.goods-name') > -1){
        return  _className + '{width:' + tWidth + 'px;height:' + tHeight + 'px;top:' + tTop + 'px;left:' + tLeft + 'px;position:absolute;overflow:hidden;}' + '\r\n'
        }
    else{
        return  _className + '{width:' + tWidth + 'px;height:' + tHeight + 'px;top:' + tTop + 'px;left:' + tLeft + 'px;position:absolute;}' + '\r\n'
        }
    
    }

//将图片部分保存单独图层
function cropNewLayer(cropAreaArray,_activeLayerName,_itemName){
    resetUnits();
    var docRef = app.activeDocument;    
    var layerRef = app.activeDocument.artLayers.getByName (_activeLayerName)//setComLayer(_activeLayerName);
    var tAreaLeft = parseInt(cropAreaArray[0]);
    var tAreaTop = parseInt(cropAreaArray[1]);
    var tAreaRight = parseInt(cropAreaArray[2]);
    var tAreaBottom = parseInt(cropAreaArray[3]);
    //activate the original layer
    docRef.activeLayer = layerRef;
    //make the selection,exp:Array (Array(x, y), Array(x, y+squareSize), Array(x+squareSize,y+squareSize), Array(x+squareSize,y))
    //943 px,85 px,1129 px,305 px
    //var t = Array(Array(943,85),Array(943,305),Array(1129,305),Array(1129,85));   
    //selection参数为Arrary(Array(左上顶点x,y坐标),Array(左下顶点x,y坐标),Array(右下顶点x,y坐标),Array(右上顶点x,y坐标))
    var t = Array(Array(tAreaLeft,tAreaTop),Array(tAreaLeft,tAreaBottom),Array(tAreaRight,tAreaBottom),Array(tAreaRight,tAreaTop)); 
    docRef.selection.select(Array(Array(tAreaLeft,tAreaTop),Array(tAreaLeft,tAreaBottom),Array(tAreaRight,tAreaBottom),Array(tAreaRight,tAreaTop)), SelectionType.REPLACE, 0, false);
    //copy the selection
    docRef.selection.copy();
    //create and paste new layer
    var newLayer = docRef.artLayers.add();
    newLayer.name = _itemName;
    docRef.paste();    
    }
//将图片部分保存新文件
function cropNewFile(cropAreaArray,_activeLayerName,_itemName,_fromDocument){
    resetUnits();    
    var docRef = _fromDocument;    
    var layerRef = docRef.artLayers.getByName (_activeLayerName)
    //第一次复制时先将源文档的当前图层置为合成后的图片层好复制图片信息，在导出文件后需要将当前激活的文档置为源文档
    if(picSaveFirst){
        docRef.activeLayer = layerRef;
        picSaveFirst = false;
        }    
    else{
        app.activeDocument = fromDoc;
        }
    var tAreaLeft = parseInt(cropAreaArray[0]);
    var tAreaTop = parseInt(cropAreaArray[1]);
    var tAreaRight = parseInt(cropAreaArray[2]);
    var tAreaBottom = parseInt(cropAreaArray[3]);
    //activate the original layer    
    //make the selection,exp:Array (Array(x, y), Array(x, y+squareSize), Array(x+squareSize,y+squareSize), Array(x+squareSize,y))
    //943 px,85 px,1129 px,305 px
    //var t = Array(Array(943,85),Array(943,305),Array(1129,305),Array(1129,85));    
    var t = Array(Array(tAreaLeft,tAreaTop),Array(tAreaLeft,tAreaBottom),Array(tAreaRight,tAreaBottom),Array(tAreaRight,tAreaTop)); 
    docRef.selection.select(Array(Array(tAreaLeft,tAreaTop),Array(tAreaLeft,tAreaBottom),Array(tAreaRight,tAreaBottom),Array(tAreaRight,tAreaTop)), SelectionType.REPLACE, 0, false);
    //copy the selection
    docRef.selection.copy();
    //create and paste new layer
    var newFile = app.documents.add(tAreaRight-tAreaLeft, tAreaBottom-tAreaTop, 72, _itemName);
newFile.paste();//curPath+ 'tmp/' + _itemName +'.jpg'

saveJPEG( app.activeDocument, new File(curPath+ '/tmp/' + _itemName +'.jpg'), 10 );  
app.activeDocument.close(SaveOptions.DONOTSAVECHANGES)
    }
saveTxt(consoleText,'console');
//重置计量单位
function resetUnits(){
    //set the ruler type
if (app.preferences.rulerUnits != Units.PIXELS)
{
    app.preferences.rulerUnits = Units.PIXELS;
}
    }
//设置复制图层
function setComLayer(_layerName){    
    return app.activeDocument.ArtLayers.getByName (_layerName);
}
//导出jpg
    function saveJPEG( doc, saveFile, qty ) {  
         var saveOptions = new JPEGSaveOptions( );  
         saveOptions.embedColorProfile = true;  
         saveOptions.formatOptions = FormatOptions.STANDARDBASELINE;  
         saveOptions.matte = MatteType.NONE;  
         saveOptions.quality = qty;   
         doc.saveAs( saveFile, saveOptions, true );  
    }  
    