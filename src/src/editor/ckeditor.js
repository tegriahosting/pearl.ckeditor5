/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import BaseClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import BaseContext from '@ckeditor/ckeditor5-core/src/context';

import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import CKBoxPlugin from '@ckeditor/ckeditor5-ckbox/src/ckbox';
import PictureEditing from '@ckeditor/ckeditor5-image/src/pictureediting.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';

import Comments from '@ckeditor/ckeditor5-comments/src/comments';
import TrackChanges from '@ckeditor/ckeditor5-track-changes/src/trackchanges';

import RealTimeCollaborativeComments from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments';
import RealTimeCollaborativeTrackChanges from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges';
import RealTimeCollaborativeEditing from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativeediting';

// Context plugins:
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import CloudServicesCommentsAdapter from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments/cloudservicescommentsadapter';
import CommentsRepository from '@ckeditor/ckeditor5-comments/src/comments/commentsrepository';
import NarrowSidebar from '@ckeditor/ckeditor5-comments/src/annotations/narrowsidebar';
import PresenceList from '@ckeditor/ckeditor5-real-time-collaboration/src/presencelist';
import WideSidebar from '@ckeditor/ckeditor5-comments/src/annotations/widesidebar';

// Tegria custom plugin
import ActionPlugin from './ActionPlugin.js';

import * as CKBox from 'ckbox';
import 'ckbox/dist/styles/ckbox.css';

export const enableColab = false;

class Context extends BaseContext {}

Context.defaultConfig = {
	language: 'en',
	comments: {
		editorConfig: {
			extraPlugins: [ Bold, Italic, Underline, List, Autoformat ]
		}
	}
};

Context.builtinPlugins = enableColab ? [
	CloudServices,
	CloudServicesCommentsAdapter,
	CommentsRepository,
	NarrowSidebar,
	PresenceList,
	WideSidebar
] : [];

class ClassicEditor extends BaseClassicEditor {}

ClassicEditor.builtinPlugins = enableColab ? [
	ActionPlugin,
	Alignment,
	Autoformat,
	BlockQuote,
	Bold,
	CKBoxPlugin,
	PictureEditing,
	Comments,
	Essentials,
	FontFamily,
	FontSize,
	Heading,
	Highlight,
	Image,
	ImageCaption,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Italic,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	RealTimeCollaborativeComments,
	RealTimeCollaborativeEditing,
	RealTimeCollaborativeTrackChanges,
	RemoveFormat,
	Strikethrough,
	Table,
	TableToolbar,
	TrackChanges,
	Underline
] : [
	ActionPlugin,
	Alignment,
	Autoformat,
	BlockQuote,
	Bold,
	PictureEditing,
	Essentials,
	FontFamily,
	FontSize,
	Heading,
	Highlight,
	Image,
	ImageCaption,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Italic,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	RemoveFormat,
	Strikethrough,
	Table,
	TableToolbar,
	Underline
];

ClassicEditor.defaultConfig = enableColab ? {
	toolbar: [
		'heading',
		'|',
		//'fontsize',
		//'fontfamily',
		//'|',
		'bold',
		'italic',
		'underline',
		'strikethrough',
		'removeFormat',
//		'highlight',
		'|',
		'alignment',
		'|',
		'numberedList',
		'bulletedList',
		'|',
		'undo',
		'redo',
		'|',
		'action-redflag',
		'action-yellowflag',
		'action-info',
		'action-choosingwisely',
		'action-valuebasedcare',
		'action-healthequity',
		'action-resourcelimited',
		'action-digitalhealth',
		'action-integrativemedicine',
		'action-reference',
		'|',
		'comment',
		'trackChanges',
		'|',
		'ckbox',
		'imageUpload',
		'link',
		'blockquote',
		'insertTable',
		'mediaEmbed'
	],
	image: {
		toolbar: [
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:side',
			'|',
			'imageTextAlternative',
			'|',
			'comment'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		],
		tableToolbar: [ 'comment' ]
	},
	mediaEmbed: {
		toolbar: [ 'comment' ]
	}
} : {
	toolbar: [
		'heading',
		'|',
		//'fontsize',
		//'fontfamily',
		//'|',
		'bold',
		'italic',
		'underline',
		'strikethrough',
		'removeFormat',
//		'highlight',
		'|',
		'alignment',
		'|',
		'numberedList',
		'bulletedList',
		'|',
		'undo',
		'redo',
		'|',
		'action-redflag',
		'action-yellowflag',
		'action-info',
		'action-choosingwisely',
		'action-valuebasedcare',
		'action-healthequity',
		'action-resourcelimited',
		'action-digitalhealth',
		'action-integrativemedicine',
		'action-reference',
		'|',
		'imageUpload',
		'link',
		'blockquote',
		'insertTable',
		'mediaEmbed'
	],
	image: {
		toolbar: [
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:side',
			'|',
			'imageTextAlternative',
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
};

export default {
	ClassicEditor,
	Context,
	CKBox
};
