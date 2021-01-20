/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/image/imageblock
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { modelToViewAttributeConverter, srcsetAttributeConverter, viewFigureToModel } from './converters';
import { toImageWidget, createImageViewElement, getImageTypeMatcher } from './utils';

/**
 * The image block plugin.
 *
 * It registers:
 *
 * * `<image>` as a block element in the document schema, and allows `alt`, `src` and `srcset` attributes.
 * * converters for editing and data pipelines.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageBlock extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImageBlock';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const t = editor.t;
		const conversion = editor.conversion;

		// Configure schema.
		schema.register( 'image', {
			isObject: true,
			isBlock: true,
			allowWhere: '$block',
			allowAttributes: [ 'alt', 'src', 'srcset' ]
		} );

		conversion.for( 'dataDowncast' )
			.elementToElement( {
				model: 'image',
				view: ( modelElement, { writer } ) => createImageViewElement( writer, 'image' )
			} );

		conversion.for( 'editingDowncast' )
			.elementToElement( {
				model: 'image',
				view: ( modelElement, { writer } ) => toImageWidget(
					createImageViewElement( writer, 'image' ), writer, t( 'image widget' )
				)
			} );

		conversion.for( 'downcast' )
			.add( modelToViewAttributeConverter( 'src', 'image' ) )
			.add( modelToViewAttributeConverter( 'alt', 'image' ) )
			.add( srcsetAttributeConverter( 'image' ) );

		conversion.for( 'upcast' )
			.elementToElement( {
				view: getImageTypeMatcher( 'image', editor ),
				model: ( viewImage, { writer } ) => writer.createElement( 'image', { src: viewImage.getAttribute( 'src' ) } )
			} )
			.add( viewFigureToModel() );
	}
}
