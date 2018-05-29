; ( function ( $, window, document, undefined ) {

    "use strict";

    var pluginName = "simpleFilter",
        defaults = {
            inputSelector: '#filterinput',
            inputAtts: {
                id: 'filterinput',
                placeholder: 'Search names ...'
            },
            listWrapper: 'ul',
            listWrapperAtts: {
                id: 'names',
                class: 'collection with-header'
            },
            collectionHeaderWrapper: 'li',
            collectionHeaderAtts: {
                class: 'collection-header'
            },
            collectionItemsWrapper: 'li',
            collectionItemAtts: {
                class: 'collection-item'
            }
        };

    function Plugin( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend( Plugin.prototype, {

        init() {
            this.setLinks( this.settings.items );
            this.buildInput();
            this.setItems( this.settings.items );
            this.buildList( this.items );
            this.buildItemsWrapper();
            this.build();
            this.initListeners();
        },

        initListeners() {
            const self = this;
            this.filterInput = document.querySelector( this.settings.inputSelector );
            this.filterInput.addEventListener( 'keyup', function ( e ) {
                this.setItems( this.getFilteredItems( this.filterInput.value ) );
                this.buildList( this.items );
                this.clearList();
                $( this.listWrapper ).append( this.listItems );
            }.bind( this ) );
        },

        clearList() {
            while ( this.listWrapper.firstChild ) {
                this.listWrapper.removeChild( this.listWrapper.firstChild );
            }
        },

        getFilteredItems( str ) {
            return Object.keys( this.settings.items ).filter( key => {
                return key.toLowerCase().indexOf( str.toLowerCase() ) > -1;
            } ).reduce( ( accumulator, current ) => ( accumulator[current] = this.settings.items[current], accumulator ), {} );
        },

        build() {
            $( this.element ).after( $( this.listWrapper ).append( this.listItems ) );
            $( this.listWrapper ).before( this.searchInput );
            $( this.element ).remove();
        },

        buildInput() {
            this.searchInput = $( '<input type="text">' );
            this.addAttributes( this.searchInput, this.settings.inputAtts );
        },

        buildItemsWrapper() {
            this.listWrapper = document.createElement( this.settings.listWrapper );
            this.addAttributes( this.listWrapper, this.settings.listWrapperAtts );
        },

        buildList( items ) {
            const wrapper = document.createElement( 'div' );
            const self = this;
            Object.keys( items ).sort().forEach( function ( item ) {
                const itemHead = document.createElement( self.settings.collectionHeaderWrapper );
                const title = document.createElement( 'h5' );
                title.textContent = item;
                itemHead.append( title );
                self.addAttributes( itemHead, self.settings.collectionHeaderAtts );
                wrapper.appendChild( itemHead );
                for ( const child of Object.keys( items[item] ) ) {
                    const itemChild = document.createElement( self.settings.collectionItemsWrapper );
                    const link = document.createElement( 'a' );
                    link.setAttribute( 'href', items[item][child] );
                    link.textContent = child;
                    self.addAttributes( itemChild, self.settings.collectionItemAtts );
                    itemChild.append( link );
                    wrapper.appendChild( itemChild );
                }
            } );
            this.listItems = wrapper.children;
        },

        setItems( items ) {
            const tempItems = {};
            for ( const key of Object.keys( items ) ) {
                const localKey = key.toLowerCase();
                const indexChar = localKey.slice( 0, 1 );
                if ( tempItems.hasOwnProperty( indexChar ) ) {
                    tempItems[indexChar][localKey] = items[key].link;
                } else {
                    tempItems[indexChar] = {};
                    tempItems[indexChar][localKey] = items[key].link;
                }
            }
            this.items = tempItems;
        },

        setLinks( items ) {
            Object.keys( items ).forEach( key => {
                if ( items[key].hasOwnProperty( 'link' ) ) {
                    items[key].link = items[key].link == '' ? '#' : items[key].link;
                } else {
                    items[key] = {};
                    items[key].link = '#'
                }
            } );
        },

        addAttributes( obj, atts ) {
            Object.keys( atts ).forEach( attr => {
                $( obj ).attr( attr, atts[attr] );
            } );
        }

    } );

    $.fn[pluginName] = function ( options ) {
        return this.each( function () {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" +
                    pluginName, new Plugin( this, options ) );
            }
        } );
    };

} )( jQuery, window, document );