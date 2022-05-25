/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import ClassicTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/classictesteditor';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import { getData as getModelData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';
import { getData as getViewData } from '@ckeditor/ckeditor5-engine/src/dev-utils/view';
import { INLINE_FILLER } from '@ckeditor/ckeditor5-engine/src/view/filler';

import GeneralHtmlSupport from '../../src/generalhtmlsupport';
import { getModelDataWithAttributes } from '../_utils/utils';

/* global document */

describe( 'CustomElementSupport', () => {
	let editor, model, editorElement, dataFilter;

	const excludeAttributes = [ 'htmlContent', 'htmlElementName' ];

	beforeEach( () => {
		editorElement = document.createElement( 'div' );
		document.body.appendChild( editorElement );

		return ClassicTestEditor
			.create( editorElement, {
				plugins: [ CodeBlock, Paragraph, GeneralHtmlSupport ]
			} )
			.then( newEditor => {
				editor = newEditor;
				model = editor.model;

				dataFilter = editor.plugins.get( 'DataFilter' );
			} );
	} );

	afterEach( () => {
		editorElement.remove();

		return editor.destroy();
	} );

	it( 'should allow unknown custom element', () => {
		dataFilter.allowElement( /.*/ );
		editor.setData( '<custom-foo-element>bar</custom-foo-element>' );

		expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
			data: '<htmlCustomElement' +
				' htmlContent="<custom-foo-element>bar</custom-foo-element>"' +
				' htmlElementName="custom-foo-element"></htmlCustomElement>',
			attributes: {}
		} );

		expect( editor.getData() ).to.equal( '<custom-foo-element>bar</custom-foo-element>' );
	} );

	it( 'should not allow unknown custom element if allow-all is not enabled', () => {
		dataFilter.allowElement( /custom-foo-element/ );
		editor.setData( '<custom-foo-element>bar</custom-foo-element>' );

		expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
			data: '<paragraph>bar</paragraph>',
			attributes: {}
		} );

		expect( editor.getData() ).to.equal( '<p>bar</p>' );
	} );

	it( 'should convert only unknown elements (not defined in DataSchema)', () => {
		dataFilter.allowElement( '$customElement' );

		editor.setData( '<article>abc</article>' );

		expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
			data: '<paragraph>abc</paragraph>',
			attributes: {}
		} );

		expect( editor.getData() ).to.equal( '<p>abc</p>' );
	} );

	it( 'should render in the editing view as an unsafe element', () => {
		dataFilter.allowElement( /.*/ );
		editor.setData( '<custom-foo-element>bar</custom-foo-element><custom-foo-element>baz</custom-foo-element>' );

		expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
			data: '<htmlCustomElement' +
				' htmlContent="<custom-foo-element>bar</custom-foo-element>"' +
				' htmlElementName="custom-foo-element"></htmlCustomElement>' +
				'<htmlCustomElement' +
				' htmlContent="<custom-foo-element>baz</custom-foo-element>"' +
				' htmlElementName="custom-foo-element"></htmlCustomElement>',
			attributes: {}
		} );

		expect( editor.getData() ).to.equal(
			'<custom-foo-element>bar</custom-foo-element>' +
			'<custom-foo-element>baz</custom-foo-element>'
		);
		expect( getViewData( editor.editing.view, { withoutSelection: true } ) ).to.equal(
			'<custom-foo-element></custom-foo-element>' +
			'<custom-foo-element></custom-foo-element>'
		);
		expect( editor.editing.view.domConverter.unsafeElements ).include( 'custom-foo-element' );
		expect( editor.editing.view.domConverter.unsafeElements )
			.deep.equal( Array.from( new Set( editor.editing.view.domConverter.unsafeElements ).values() ) );

		expect( editor.editing.view.getDomRoot().innerHTML ).equal(
			INLINE_FILLER +
			'<span data-ck-unsafe-element="custom-foo-element"></span>' +
			'<span data-ck-unsafe-element="custom-foo-element"></span>'
		);
	} );

	it( 'should render in the editing view as a pre block (whitespace handling)', () => {
		dataFilter.allowElement( /.*/ );
		editor.setData(
			'<custom-foo-element><nested> a </nested></custom-foo-element>' +
			'<custom-foo-element><nested> b </nested></custom-foo-element>'
		);

		expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
			data:
				'<htmlCustomElement' +
				' htmlContent="<custom-foo-element><nested>a </nested></custom-foo-element>"' +
				' htmlElementName="custom-foo-element"></htmlCustomElement>' +
				'<htmlCustomElement' +
				' htmlContent="<custom-foo-element><nested>b</nested></custom-foo-element>"' +
				' htmlElementName="custom-foo-element"></htmlCustomElement>',
			attributes: {}
		} );

		expect( editor.getData() ).to.equal(
			'<custom-foo-element><nested>a </nested></custom-foo-element>' +
			'<custom-foo-element><nested>b</nested></custom-foo-element>'
		);
		expect( editor.data.htmlProcessor.domConverter.preElements ).include( 'custom-foo-element' );
		expect( editor.data.htmlProcessor.domConverter.preElements )
			.deep.equal( Array.from( new Set( editor.data.htmlProcessor.domConverter.preElements ).values() ) );
	} );

	describe( 'element position', () => {
		const testCases = [ {
			name: 'paragraph',
			data: '<article><section><p>Foo<custom-foo-element>abc</custom-foo-element>Bar</p></section></article>',
			model:
				'<htmlArticle>' +
					'<htmlSection>' +
						'<paragraph>' +
							'Foo' +
							'<htmlCustomElement' +
								' htmlContent="<custom-foo-element>abc</custom-foo-element>"' +
								' htmlElementName="custom-foo-element">' +
							'</htmlCustomElement>' +
							'Bar' +
						'</paragraph>' +
					'</htmlSection>' +
				'</htmlArticle>'
		}, {
			name: 'section',
			data: '<article><section><p>Foo</p><custom-foo-element>abc</custom-foo-element></section></article>',
			model:
				'<htmlArticle>' +
					'<htmlSection>' +
						'<paragraph>Foo</paragraph>' +
						'<htmlCustomElement' +
							' htmlContent="<custom-foo-element>abc</custom-foo-element>"' +
							' htmlElementName="custom-foo-element">' +
						'</htmlCustomElement>' +
					'</htmlSection>' +
				'</htmlArticle>'
		}, {
			name: 'article',
			data: '<article><section><p>Foo</p></section><custom-foo-element>abc</custom-foo-element></article>',
			model:
				'<htmlArticle>' +
					'<htmlSection>' +
						'<paragraph>Foo</paragraph>' +
					'</htmlSection>' +
					'<htmlCustomElement' +
						' htmlContent="<custom-foo-element>abc</custom-foo-element>"' +
						' htmlElementName="custom-foo-element">' +
					'</htmlCustomElement>' +
				'</htmlArticle>'
		}, {
			name: 'root',
			data: '<article><section><p>Foo</p></section></article><custom-foo-element>abc</custom-foo-element>',
			model:
				'<htmlArticle>' +
					'<htmlSection>' +
						'<paragraph>Foo</paragraph>' +
					'</htmlSection>' +
				'</htmlArticle>' +
				'<htmlCustomElement' +
					' htmlContent="<custom-foo-element>abc</custom-foo-element>"' +
					' htmlElementName="custom-foo-element">' +
				'</htmlCustomElement>'
		} ];

		for ( const { name, data, model: modelData } of testCases ) {
			it( `should allow element inside ${ name }`, () => {
				dataFilter.allowElement( /.*/ );

				editor.setData( data );

				expect( getModelData( model, { withoutSelection: true, excludeAttributes } ) ).to.equal( modelData );

				expect( editor.getData() ).to.equal( data );
			} );
		}
	} );

	describe( 'content', () => {
		it( 'should preserve custom element content', () => {
			dataFilter.allowElement( /.*/ );
			editor.setData( 'foo <custom>  this is <p>some content</p> and more of it  </custom> bar' );

			expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
				data:
					'<paragraph>foo ' +
					'<htmlCustomElement' +
					' htmlContent="<custom>this is<p>some content</p>and more of it </custom>"' +
					' htmlElementName="custom"></htmlCustomElement>' +
					'bar</paragraph>',
				attributes: {}
			} );

			expect( editor.getData() ).to.equal( '<p>foo <custom>this is<p>some content</p>and more of it </custom>bar</p>' );
		} );

		it( 'should not inject nbsp in the element content', () => {
			dataFilter.allowElement( /.*/ );
			editor.setData( '<custom><custom2> c </custom2></custom>' );

			expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
				data: '<htmlCustomElement' +
					' htmlContent="<custom><custom2>c</custom2></custom>"' +
					' htmlElementName="custom"></htmlCustomElement>',
				attributes: {}
			} );

			expect( editor.getData() ).to.equal( '<custom><custom2>c</custom2></custom>' );
		} );
	} );

	describe( 'attributes', () => {
		it( 'should allow attributes', () => {
			dataFilter.allowElement( /.*/ );
			dataFilter.allowAttributes( { attributes: { 'data-foo': /.*/ } } );

			editor.setData( '<custom-foo-element data-foo="foo">bar</custom-foo-element>' );

			expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
				data: '<htmlCustomElement' +
					' htmlAttributes="(1)"' +
					' htmlContent="<custom-foo-element data-foo="foo">bar</custom-foo-element>"' +
					' htmlElementName="custom-foo-element"></htmlCustomElement>',
				attributes: {
					1: {
						attributes: {
							'data-foo': 'foo'
						}
					}
				}
			} );

			expect( editor.getData() ).to.equal( '<custom-foo-element data-foo="foo">bar</custom-foo-element>' );
		} );

		it( 'should allow attributes (classes)', () => {
			dataFilter.allowElement( /.*/ );
			dataFilter.allowAttributes( { classes: 'foo' } );

			editor.setData( '<custom-foo-element class="foo">bar</custom-foo-element>' );

			expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
				data: '<htmlCustomElement' +
					' htmlAttributes="(1)"' +
					' htmlContent="<custom-foo-element class="foo">bar</custom-foo-element>"' +
					' htmlElementName="custom-foo-element"></htmlCustomElement>',
				attributes: {
					1: {
						classes: [ 'foo' ]
					}
				}
			} );

			expect( editor.getData() ).to.equal( '<custom-foo-element class="foo">bar</custom-foo-element>' );
		} );

		it( 'should allow attributes (styles)', () => {
			dataFilter.allowElement( /.*/ );
			dataFilter.allowAttributes( { styles: { background: true } } );

			editor.setData( '<custom-foo-element style="background: red">bar</custom-foo-element>' );

			expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
				data: '<htmlCustomElement' +
					' htmlAttributes="(1)"' +
					' htmlContent="<custom-foo-element style="background:red;">bar</custom-foo-element>"' +
					' htmlElementName="custom-foo-element"></htmlCustomElement>',
				attributes: {
					1: {
						'styles': {
							'background': 'red'
						}
					}
				}
			} );

			expect( editor.getData() ).to.equal( '<custom-foo-element style="background:red;">bar</custom-foo-element>' );
		} );

		it( 'should disallow attributes', () => {
			dataFilter.allowElement( /.*/ );
			dataFilter.allowAttributes( { attributes: { 'data-foo': /.*/ } } );
			dataFilter.disallowAttributes( { attributes: { 'data-foo': /.*/ } } );

			editor.setData( '<custom-foo-element data-foo="foo">bar</custom-foo-element>' );

			expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
				data: '<htmlCustomElement' +
					' htmlContent="<custom-foo-element data-foo="foo">bar</custom-foo-element>"' +
					' htmlElementName="custom-foo-element"></htmlCustomElement>',
				attributes: {}
			} );

			expect( editor.getData() ).to.equal( '<custom-foo-element>bar</custom-foo-element>' );
		} );

		it( 'should disallow attributes (classes)', () => {
			dataFilter.allowElement( /.*/ );
			dataFilter.allowAttributes( { classes: 'foo' } );
			dataFilter.disallowAttributes( { classes: 'foo' } );

			editor.setData( '<custom-foo-element class="foo">bar</custom-foo-element>' );

			expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
				data: '<htmlCustomElement' +
					' htmlContent="<custom-foo-element class="foo">bar</custom-foo-element>"' +
					' htmlElementName="custom-foo-element"></htmlCustomElement>',
				attributes: {}
			} );

			expect( editor.getData() ).to.equal( '<custom-foo-element>bar</custom-foo-element>' );
		} );

		it( 'should disallow attributes (styles)', () => {
			dataFilter.allowElement( /.*/ );
			dataFilter.allowAttributes( { styles: { background: true } } );
			dataFilter.disallowAttributes( { styles: { background: true } } );

			editor.setData( '<custom-foo-element style="background: red">bar</custom-foo-element>' );

			expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
				data: '<htmlCustomElement' +
					' htmlContent="<custom-foo-element style="background:red;">bar</custom-foo-element>"' +
					' htmlElementName="custom-foo-element"></htmlCustomElement>',
				attributes: {}
			} );

			expect( editor.getData() ).to.equal( '<custom-foo-element>bar</custom-foo-element>' );
		} );
	} );

	it( 'should not convert html comments as a custom element', () => {
		dataFilter.allowElement( /.*/ );

		editor.setData( '<!-- foo --><custom>bar</custom>' );

		expect( getModelDataWithAttributes( model, { withoutSelection: true, excludeAttributes } ) ).to.deep.equal( {
			data: '<htmlCustomElement htmlContent="<custom>bar</custom>" htmlElementName="custom"></htmlCustomElement>',
			attributes: {}
		} );

		expect( editor.getData() ).to.equal( '<custom>bar</custom>' );
	} );
} );
