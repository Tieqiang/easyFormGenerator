/* global angular */
import {
	initDebugModel,
	initTabModel,
	initColumnTemplate,
	initLineTemplate,
	initIhmModel
}												from './edaDragDropWay.edaDragdropWayEasyFormGen.controller.helpers.js';

const DRAG_DROP_WAY_EASY_FORM_GEN_CONTROLLER 		= 'edaDragDropWayEasyFormGenCtrl';
const DRAG_DROP_WAY_EASY_FORM_GEN_CONTROLLERAS 	= 'vm';


class edaDragDropWayEasyFormGenCtrl{
	
	constructor(
		easyFormGenVersion,
		$filter,
		$anchorScroll,
		toaster,
		$timeout, 
		$modal,
		$log, 
		formFieldManage, 
		controllerModalProxy,
		dragDropItemDecorationService,
		dragDropConfig,
		ddModelConfModelProxyService,
		ddItemRightClickedManager,
		easyFormDragWayConfig		
	){
		this.easyFormGenVersion 							= easyFormGenVersion;
		this.$filter													= $filter;
		this.$anchorScroll 										= $anchorScroll;
		this.toaster 													= toaster;
		this.$timeout 												= $timeout; 
		this.$modal														= $modal;
		this.$log															= $log; 
		this.formFieldManage									= formFieldManage; 
		this.controllerModalProxy 						= controllerModalProxy;
		this.dragDropItemDecorationService		= dragDropItemDecorationService;
		this.dragDropConfig										= dragDropConfig;
		this.ddModelConfModelProxyService			= ddModelConfModelProxyService;
		this.ddItemRightClickedManager				= ddItemRightClickedManager;
		this.easyFormDragWayConfig						= easyFormDragWayConfig;
		
		this.init();
	}
	
	init(){
		this.easyFormGeneratorVERSION 				= this.easyFormGenVersion;
		this.tab                      				= initTabModel(this.easyFormDragWayConfig.isPreviewPanelVisible(), this.easyFormDragWayConfig.arePreviewModelsVisible());
		this.returnSaveEvent 									= false;
		this.dataModel               			 		= {}; //was vm.model in ES5 version
		this.wfFormFields          						= [];
		this.wfFormFieldsOnlyNeededProperties	= [];
		this.ihm															= initIhmModel();
		this.easyFormDragDropProperties 			= this.dragDropConfig.getDragDropConfigModel();
		this.dragDropModel 										= [].concat(this.dragDropConfig.getDragDropPresentationModel());
		this.numberOfColumns 									= 1;	
		this.MaxNumberOfColumns 							= 3;
    this.MinNumberOfColumns 							= 1;
		this.configuration 										= {};
		
		this.formFieldManage.initConfigurationEditFromScratch(this.configuration , false);
		this.controllerModalProxy.initProxyModel();
	}
	
	collapseAllGroupControl(allExceptThisGroupIndex){        
		angular.forEach(this.easyFormDragDropProperties.containerConfig.decoration, (value)=>{
			if (value.WhenIndex !== allExceptThisGroupIndex) this.dragDropConfig.setDragDropConfigContainerDecorationCollapse(this.easyFormDragDropProperties, value.WhenIndex, true);
		});
	}
	
	
	onSubmit() {
		this.toaster.pop({
			type						: 'info',
			timeout					: 2000,
			title						: 'should save data model if it were not a static example',
			body						: 'data :' + this.$filter('json')(this.dataModel, 4),                
			showCloseButton	: true
		});
	}
	
	resetToZeroModel(){
		this.configuration.activeLine = 1;
		if (this.configuration.lines.length > 1) this.configuration.lines.splice(1, this.configuration.lines.length - 2);
		return this.countConfigurationModelLines();
	}


	countConfigurationModelLines(){
		return this.configuration.lines.length;
	}

	setActiveLineNumber(lineNumber){
		if (lineNumber <= this.countConfigurationModelLines()) this.configuration.activeLine = lineNumber;
	}

	upThisLine(indexLine){
		if (indexLine > -1) {
			if (this.configuration.lines[indexLine - 1]) {
				let currentLineObj = this.configuration.lines[indexLine];
				this.configuration.lines.splice(indexLine , 1);
				this.configuration.lines.splice((indexLine - 1), 0, currentLineObj);
				this.configuration.activeLine = 1;
			}
		}

		this.formFieldManage.applyConfigurationToformlyModel(this.configuration, this.wfFormFields, this.dataModel);
		this.wfFormFieldsOnlyNeededProperties = angular.copy(this.wfFormFields);
	}

	downThisLine(indexLine){
		if (indexLine > -1) {
			if (this.configuration.lines[indexLine + 1]) {
				let currentLineObj = this.configuration.lines[indexLine];
				this.configuration.lines.splice(indexLine , 1);
				this.configuration.lines.splice((indexLine + 1), 0, currentLineObj);
				this.configuration.activeLine = 1;
			}
		}
		this.formFieldManage.applyConfigurationToformlyModel(this.configuration, this.wfFormFields, this.dataModel);
		this.wfFormFieldsOnlyNeededProperties = angular.copy(this.wfFormFields);
	}

	removeThisLine(index){
		if (index > -1) {
			if (this.configuration.lines.length > 1) {
				if (this.configuration.activeLine === index + 1) this.configuration.activeLine = 1;
				this.configuration.lines.splice(index, 1);
			}else{
				this.$timeout(()=>{
					this.toaster.pop({
						type						: 'warning',
						title						: 'Last line' ,
						body						: `Can't delete the last line`,
						showCloseButton	: true
					});
				}, 100);
			}
			this.formFieldManage.applyConfigurationToformlyModel(this.configuration, this.wfFormFields, this.dataModel);
			this.wfFormFieldsOnlyNeededProperties = angular.copy(this.wfFormFields);
		}
	}


}

edaDragDropWayEasyFormGenCtrl.$inject = [ 
		'easyFormGenVersion',
		'$filter',
		'$anchorScroll',
		'toaster',
		'$timeout', 
		'$modal',
		'$log', 
		'formFieldManage', 
		'controllerModalProxy',
		'dragDropItemDecorationService',
		'dragDropConfig',
		'ddModelConfModelProxyService',
		'ddItemRightClickedManager'	,
		'easyFormDragWayConfig'
];

export default edaDragDropWayEasyFormGenCtrl;

export {
	DRAG_DROP_WAY_EASY_FORM_GEN_CONTROLLER,
	DRAG_DROP_WAY_EASY_FORM_GEN_CONTROLLERAS
};