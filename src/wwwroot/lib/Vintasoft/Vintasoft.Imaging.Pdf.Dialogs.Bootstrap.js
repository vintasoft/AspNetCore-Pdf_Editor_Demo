﻿// Copyright 2014-2025 VintaSoft LLC. All rights reserved.
// This software is protected by International copyright laws.
// Any copying, duplication, deployment, redistribution, modification or other
// disposition hereof is STRICTLY PROHIBITED without an express written license
// granted by VintaSoft LLC. This notice may not be removed or otherwise
// altered under any circumstances.
// This code may NOT be used apart of the VintaSoft product.
var Vintasoft;
(function(c){function a(a,c,v){a=l[a];for(var q="",b=c;b<c+v;b++)q+=String.fromCharCode(a[b]^255);return q}if(void 0==c||void 0==c.Shared)throw Error("Vintasoft.Shared is not found.");if("4.4.0.1"!==c.version)throw Error("Wrong version of Vintasoft.Shared script.");if(void 0==c.Imaging)throw Error("Vintasoft.Imaging is not found.");if("14.0.9.1"!==c.Imaging.version)throw Error("Wrong version of Vintasoft.Imaging script.");if(void 0==c.Imaging.Pdf)throw Error("Vintasoft.Imaging.Pdf is not found.");if("10.0.9.1"!==
c.Imaging.Pdf.version)throw Error("Wrong version of Vintasoft.Imaging.Pdf script.");var l=[];l.push([137,140,138,150,210,155,150,158,147,144,152,223,143,155,153,173,154,155,158,156,139,150,144,145,178,158,141,148,172,154,139,139,150,145,152,140,137,140,138,150,210,143,155,153,190,188,144,145,137,154,141,140,150,144,145,190,145,155,169,158,147,150,155,158,139,150,144,145,187,150,158,147,144,152,210,137,158,147,150,155,158,139,154,175,155,153,158,189,138,139,139,144,145,175,187,185,223,150,146,158,
152,154,223,141,154,140,144,138,141,156,154,136,158,141,145,150,145,152,176,156,156,138,141,154,155,175,187,185,223,141,154,155,158,156,139,150,144,145,223,146,158,141,148,223,140,154,139,139,150,145,152,140,143,155,153,182,146,158,152,154,173,154,140,144,138,141,156,154,187,150,158,147,144,152,175,187,185,223,156,144,146,143,141,154,140,140,144,141,137,140,138,150,210,143,155,153,187,144,156,138,146,154,145,139,188,144,146,143,141,154,140,140,144,141,187,150,158,147,144,152,210,139,150,139,147,154,
137,140,138,150,210,143,155,153,187,144,156,138,146,154,145,139,188,144,146,143,141,154,140,140,144,141,187,150,158,147,144,152,210,156,147,144,140,154,189,138,139,139,144,145,137,140,138,150,210,155,150,158,147,144,152,223,143,155,153,190,188,144,145,137,154,141,140,150,144,145,190,145,155,169,158,147,150,155,158,139,150,144,145,187,150,158,147,144,152,137,140,138,150,210,143,155,153,187,144,156,138,146,154,145,139,188,144,146,143,141,154,140,140,144,141,187,150,158,147,144,152,210,140,158,137,154,
189,138,139,139,144,145,169,158,147,150,155,158,139,154,223,175,187,185,208,190,137,140,143,154,210,143,155,153,187,144,156,138,146,154,145,139,188,144,146,143,141,154,140,140,144,141,175,158,145,154,147,188,144,145,137,154,141,139,223,139,144,223,175,187,185,208,190,143,155,153,190,188,144,145,137,154,141,140,150,144,145,190,145,155,169,158,147,150,155,158,139,150,144,145,187,150,158,147,144,152,146,144,155,158,147,210,139,150,139,147,154,175,187,185,208,190,223,156,144,145,137,154,141,140,150,144,
145,223,158,145,155,223,137,158,147,150,155,158,139,150,144,145,157,139,145,223,157,139,145,210,143,141,150,146,158,141,134,137,140,138,150,210,143,155,153,190,188,144,145,137,154,141,140,150,144,145,190,145,155,169,158,147,150,155,158,139,150,144,145,187,150,158,147,144,152,210,139,150,139,147,154,137,140,138,150,210,143,155,153,182,146,158,152,154,173,154,140,144,138,141,156,154,187,150,158,147,144,152,210,139,150,139,147,154,154,135,154,156,138,139,154,188,144,146,143,141,154,140,140,150,144,145,
189,138,139,139,144,145,143,155,153,173,154,155,158,156,139,150,144,145,178,158,141,148,172,154,139,139,150,145,152,140,187,150,158,147,144,152,137,140,138,150,210,155,150,158,147,144,152,210,144,148,189,138,139,139,144,145,206,143,135,223,140,144,147,150,155,223,152,141,158,134,137,140,138,150,210,143,155,153,187,144,156,138,146,154,145,139,188,144,146,143,141,154,140,140,144,141,187,150,158,147,144,152,210,154,135,154,156,138,139,154,188,144,146,143,141,154,140,140,150,144,145,189,138,139,139,144,
145,137,140,138,150,210,155,150,158,147,144,152,188,144,145,139,154,145,139,146,144,155,158,147,210,155,150,158,147,144,152,146,158,135,210,156,144,145,139,154,145,139,137,140,138,150,210,143,155,153,190,188,144,145,137,154,141,140,150,144,145,190,145,155,169,158,147,150,155,158,139,150,144,145,187,150,158,147,144,152,210,156,147,144,140,154,189,138,139,139,144,145,169,150,154,136,154,141,223,155,144,154,140,223,145,144,139,223,151,158,137,154,223,150,146,158,152,154,140,209,176,180,207,143,135,158,
140,134,145,156,176,143,154,141,158,139,150,144,145,185,158,150,147,154,155,137,158,147,150,155,158,139,154,175,155,153,158,189,138,139,139,144,145,137,140,138,150,210,155,150,158,147,144,152,223,143,155,153,182,146,158,152,154,173,154,140,144,138,141,156,154,156,147,144,140,154,189,138,139,139,144,145,143,155,153,187,144,156,138,146,154,145,139,188,144,146,143,141,154,140,140,144,141,187,150,158,147,144,152,137,140,138,150,210,143,155,153,173,154,155,158,156,139,150,144,145,178,158,141,148,190,143,
143,154,158,141,158,145,156,154,187,150,158,147,144,152,210,139,150,139,147,154,144,148,189,138,139,139,144,145,172,158,137,154,188,144,146,143,141,154,140,140,223,175,187,185,188,147,144,140,154,157,139,145,223,157,139,145,210,155,154,153,158,138,147,139,137,140,138,150,210,143,155,153,173,154,155,158,156,139,150,144,145,178,158,141,148,172,154,139,139,150,145,152,140,187,150,158,147,144,152,210,139,150,139,147,154,137,140,138,150,210,155,150,158,147,144,152,188,144,145,139,154,145,139,223,137,140,
143,154,210,143,155,153,190,188,144,145,137,154,141,140,150,144,145,190,145,155,169,158,147,150,155,158,139,150,144,145,175,158,145,154,147,143,155,153,173,154,155,158,156,139,150,144,145,178,158,141,148,190,143,143,154,158,141,158,145,156,154,187,150,158,147,144,152,175,187,185,223,141,154,155,158,156,139,150,144,145,223,146,158,141,148,223,158,143,143,154,158,141,158,145,156,154,156,144,145,137,154,141,139,171,144,175,155,153,158,189,138,139,139,144,145,158,140,134,145,156,176,143,154,141,158,139,
150,144,145,185,150,145,150,140,151,154,155,137,140,138,150,210,155,150,158,147,144,152,223,143,155,153,187,144,156,138,146,154,145,139,188,144,146,143,141,154,140,140,144,141,187,150,158,147,144,152,137,140,138,150,210,155,150,158,147,144,152,223,143,155,153,173,154,155,158,156,139,150,144,145,178,158,141,148,190,143,143,154,158,141,158,145,156,154,140,158,137,154,189,138,139,139,144,145,158,140,134,145,156,176,143,154,141,158,139,150,144,145,172,139,158,141,139,154,155,137,140,138,150,210,143,155,
153,190,188,144,145,137,154,141,140,150,144,145,190,145,155,169,158,147,150,155,158,139,150,144,145,187,150,158,147,144,152,210,156,144,145,137,154,141,139,171,144,175,155,153,158,189,138,139,139,144,145]);c.Imaging=c.Imaging;(function(d){d.Pdf=d.Pdf;(function(d){d.UI=d.UI;(function(d){d.Dialogs={};(function(d){var b=c.Shared,l=c.Imaging,e=l.UI,f=e.UIElements,e=e.Dialogs,r=l.Pdf.UI,s=function(){var m=s.superclass;b.VintasoftLocalizationJS.setStringConstant(a(0,959,43),a(0,1175,29));b.VintasoftLocalizationJS.setStringConstant(a(0,
640,20),a(0,850,2));var d=this,c=new f.WebUiLabelElementJS({text:b.VintasoftLocalizationJS.getStringConstant(a(0,959,43)),cssClass:a(0,452,11)});c.set_HeaderIndex(5);var g=new r.Panels.WebUiPdfRedactionMarkAppearancePanelJS({cssClass:a(0,731,18)}),h=new f.WebUiButtonInputJS({cssClass:a(0,494,15),value:b.VintasoftLocalizationJS.getStringConstant(a(0,640,20)),localizationId:a(0,1002,8),onClick:{callback:function(){d.hide()}}}),k={cssClass:a(0,1284,38),localizationId:a(0,1143,32)};m.constructor.call(this,
[c],[g],[h],k)};b.extend(s,e.WebUiDialogJS);var t=function(m){var c=t.superclass;b.VintasoftLocalizationJS.setStringConstant(a(0,1046,41),a(0,125,27));b.VintasoftLocalizationJS.setStringConstant(a(0,640,20),a(0,850,2));var d=this,g=new f.WebUiLabelElementJS({text:b.VintasoftLocalizationJS.getStringConstant(a(0,1046,41)),cssClass:a(0,452,11)});g.set_HeaderIndex(5);m=new r.Panels.WebUiPdfRedactionMarkSettingsPanelJS({cssClass:a(0,731,18),css:{padding:a(0,852,3),border:a(0,660,14)}},m);var h=new f.WebUiButtonInputJS({cssClass:a(0,
494,15),value:b.VintasoftLocalizationJS.getStringConstant(a(0,640,20)),localizationId:a(0,1002,8),onClick:{callback:function(){d.hide()}}}),k={cssClass:a(0,0,36),localizationId:a(0,610,30)};c.constructor.call(this,[g],[m],[h],k)};b.extend(t,e.WebUiDialogJS);var u=function(m){var c=u.superclass;b.VintasoftLocalizationJS.setStringConstant(a(0,553,33),a(0,93,18));b.VintasoftLocalizationJS.setStringConstant(a(0,640,20),a(0,850,2));var d=this,g=new f.WebUiLabelElementJS({text:b.VintasoftLocalizationJS.getStringConstant(a(0,
553,33)),cssClass:a(0,452,11)});g.set_HeaderIndex(5);m=new r.Panels.WebUiPdfImageResourcePanelJS({cssClass:a(0,731,18),css:{padding:a(0,852,3),border:a(0,660,14)}},m);var h=new f.WebUiButtonInputJS({cssClass:a(0,494,15),value:b.VintasoftLocalizationJS.getStringConstant(a(0,640,20)),localizationId:a(0,1002,8),onClick:{callback:function(){d.hide()}}}),k={cssClass:a(0,893,28),localizationId:a(0,152,22)};c.constructor.call(this,[g],[m],[h],k)};b.extend(u,e.WebUiDialogJS);var n=function(){var c=n.superclass;
n.prototype.show=function(){if(0==this.get_RootControl().get_ImageViewer().get_Images().get_Count()){var b=a(0,822,28);this._24995(a(0,111,14),{message:b})}else c.show.call(this)};c=n.superclass;b.VintasoftLocalizationJS.setStringConstant(a(0,509,44),a(0,463,31));b.VintasoftLocalizationJS.setStringConstant(a(0,1353,58),a(0,403,16));b.VintasoftLocalizationJS.setStringConstant(a(0,36,57),a(0,358,14));b.VintasoftLocalizationJS.setStringConstant(a(0,772,50),a(0,1026,5));var d=this,e=new f.WebUiLabelElementJS({text:b.VintasoftLocalizationJS.getStringConstant(a(0,
509,44)),cssClass:a(0,452,11)});e.set_HeaderIndex(5);var g=new r.Panels.WebUiPdfAConversionAndValidationPanelJS({cssClass:a(0,1087,56)});this._20544=g;var h=new f.WebUiButtonInputJS({cssClass:a(0,494,15),value:b.VintasoftLocalizationJS.getStringConstant(a(0,1353,58)),localizationId:a(0,1204,19),onClick:{callback:function(){d._20544.convertToPdfA()}}}),k=new f.WebUiButtonInputJS({cssClass:a(0,494,15),value:b.VintasoftLocalizationJS.getStringConstant(a(0,36,57)),localizationId:a(0,875,18),onClick:{callback:function(){d._20544.validatePdfA()}}}),
l=new f.WebUiButtonInputJS({cssClass:a(0,1031,15),value:b.VintasoftLocalizationJS.getStringConstant(a(0,772,50)),localizationId:a(0,921,11),onClick:{callback:function(){d.hide()}}}),p={cssClass:a(0,270,45),localizationId:a(0,419,33)};c.constructor.call(this,[e],[g],[h,k,l],p)};b.extend(n,e.WebUiDialogJS);var p=function(){var c=p.prototype,d=p.superclass;c.asyncOperationStarted=function(a,b){};c.asyncOperationFinished=function(a,b){};c.asyncOperationFailed=function(a,b){};c.render=function(b){b=d.render.call(this,
b);b.getElementsByClassName(a(0,749,12))[0].style.maxWidth=a(0,761,11);return b};c.show=function(){if(0==this.get_RootControl().get_ImageViewer().get_Images().get_Count()){var b=a(0,822,28);this._24995(a(0,111,14),{message:b})}else d.show.call(this)};d=p.superclass;b.VintasoftLocalizationJS.setStringConstant(a(0,188,38),a(0,174,14));b.VintasoftLocalizationJS.setStringConstant(a(0,674,57),a(0,1014,12));b.VintasoftLocalizationJS.setStringConstant(a(0,315,43),a(0,1010,4));b.VintasoftLocalizationJS.setStringConstant(a(0,
226,44),a(0,1026,5));var e=this,g=new f.WebUiLabelElementJS({text:b.VintasoftLocalizationJS.getStringConstant(a(0,188,38)),cssClass:a(0,452,11)});g.set_HeaderIndex(5);var h=new r.Panels.WebUiPdfDocumentCompressorPanelJS({cssClass:a(0,372,31)});this._1430=h;var k=new f.WebUiButtonInputJS({cssClass:a(0,494,15),value:b.VintasoftLocalizationJS.getStringConstant(a(0,315,43)),localizationId:a(0,1322,10),disabled:!0,onClick:{callback:function(){e._1430.saveCompressedFile()}}});this._29691=k;var l=new f.WebUiButtonInputJS({cssClass:a(0,
494,15),value:b.VintasoftLocalizationJS.getStringConstant(a(0,674,57)),localizationId:a(0,586,24),onClick:{callback:function(){e._1430.compressPdf()}}}),n=new f.WebUiButtonInputJS({cssClass:a(0,1031,15),value:b.VintasoftLocalizationJS.getStringConstant(a(0,226,44)),localizationId:a(0,921,11),onClick:{callback:function(){e.hide()}}});b.suf23(h,a(0,1332,21),{a:this},function(b,c){b.data.a._9195(a(0,1332,21),c)});b.suf23(h,a(0,1223,22),{a:this},function(b,c){var d=b.data.a;d._29691.set_IsEnabled(!0);
d._9195(a(0,1223,22),c)});b.suf23(h,a(0,855,20),{a:this},function(b,c){b.data.a._9195(a(0,855,20),c)});var q={cssClass:a(0,1245,39),localizationId:a(0,932,27)};d.constructor.call(this,[g],[h],[l,k,n],q);delete c.asyncOperationStarted;delete c.asyncOperationFinished;delete c.asyncOperationFailed};b.extend(p,e.WebUiDialogJS);d.WebPdfRedactionMarkAppearanceDialogJS=s;d.WebUiPdfRedactionMarkSettingsDialogJS=t;d.WebUiPdfImageResourceDialogJS=u;d.WebUiPdfAConversionAndValidationDialogJS=n;d.WebPdfDocumentCompressorDialogJS=
p})(d.Dialogs)})(d.UI)})(d.Pdf)})(c.Imaging)})(Vintasoft);
