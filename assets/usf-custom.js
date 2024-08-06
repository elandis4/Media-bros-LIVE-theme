// define templates for the Venue theme | 4.5.2
var _usfImageWidths;
var _globalSettings = {
    product_grid_masonry: false,
    product_grid_detail_style: "default",
    product_grid_image_size: "natural",
    product_grid_align: "center",
    product_grid_label: true,
    product_grid_label_collection: "",
    product_grid_label_sale_style: "percentage",
    product_grid_label_new: false,
    product_grid_label_new_days: 14,
    product_grid_second_hover: true,
    product_grid_quick_buy: "disabled",
    product_grid_vendor: true,
    product_grid_price: true,
    product_reviews: true,
    product_grid_reviews: true,
    product_grid_swatch: true,
    product_grid_swatch_image: true,
    secondary_images_hover: null
};
usf.platform.useProductsUrl = true;
var css_color_names = ('aliceblue, antiquewhite, aqua, aquamarine, azure, beige, bisque, black, blanchedalmond, blue, blueviolet, brown, burlywood, cadetblue, chartreuse, chocolate, coral, cornflowerblue, cornsilk, crimson, cyan, darkblue, darkcyan, darkgoldenrod, darkgray, darkgreen, darkkhaki, darkmagenta, darkolivegreen, darkorange, darkorchid, darkred, darksalmon, darkseagreen, darkslateblue, darkslategray, darkturquoise, darkviolet, deeppink, deepskyblue, dimgray, dodgerblue, firebrick, floralwhite, forestgreen, fuchsia, gainsboro, ghostwhite, gold, goldenrod, gray, green, greenyellow, honeydew, hotpink, indianred, indigo, ivory, khaki, lavender, lavenderblush, lawngreen, lemonchiffon, lightblue, lightcoral, lightcyan, lightgoldenrodyellow, lightgreen, lightgrey, lightpink, lightsalmon, lightseagreen, lightskyblue, lightslategray, lightsteelblue, lightyellow, lime, limegreen, linen, magenta, maroon, mediumauqamarine, mediumblue, mediumorchid, mediumpurple, mediumseagreen, mediumslateblue, mediumspringgreen, mediumturquoise, mediumvioletred, midnightblue, mintcream, mistyrose, moccasin, navajowhite, navy, oldlace, olive, olivedrab, orange, orangered, orchid, palegoldenrod, palegreen, paleturquoise, palevioletred, papayawhip, peachpuff, peru, pink, plum, powderblue, purple, red, rosybrown, royalblue, saddlebrown, salmon, sandybrown, seagreen, seashell, sienna, silver, skyblue, slateblue, slategray, snow, springgreen, steelblue, tan, teal, thistle, tomato, turquoise, violet, wheat, white, whitesmoke, yellow, yellowgreen').split(', ')

var _sectionSettings = {
    grid: 3,
    grid_mobile: "2",
};
var _gridItemWidth = "u-1\/2@phab u-1\/3@tab";
var _productRatio = "custom";

var _usfGridWrapClass = ` o-layout ${_globalSettings.product_grid_masonry ? ' o-layout--masonry ' : ''} ${_sectionSettings.grid == '4' ? ' o-layout--small ' : ''} ${_sectionSettings.grid_mobile == '2' ? '' : ' o-layout--small@tab-down '}`;


function _getGridItemClass(t) {
    var cls = 'product js-product ';
    if (_globalSettings.product_grid_detail_style === 'hover')
        cls += ` product--details-hover `;
    if (t.isSoldOut)
        cls += ` product--sold-out `;
    if (t.hasDiscount)
        cls += ` product--sale `;
    cls += 'product--';
    if (_globalSettings.product_grid_image_size.includes('crop'))
        cls += 'crop';
    else if (_globalSettings.product_grid_image_size.includes('flip'))
        cls += 'flip';
    else
        cls += 'natural';
    cls += ` product--${_globalSettings.product_grid_align} `;
    return cls
};

const _usfBgsetWidths = [180, 360, 540, 720, 900, 1080, 1296, 1512, 1728, 1950, 2100, 2260, 2450, 2700, 3000, 3350, 3750, 4100]

function _usfGetBgset(image) {
    if (image.url === usf.platform.emptyImage.url)
        return image.url;
    var aspectRatio = _usfGetImageRatio(image);
    var imgUrl = "";
    _usfBgsetWidths.find(width => {
        if (image.width > width) {
            var h = aspectRatio * width;
            var size = `_${width}x`;
            var url = image.url;
            if (url.includes(`_${usf.settings.search.imageSize}x.`))
                url = url.replace(`_${usf.settings.search.imageSize}x.`, `${size}.`);
            else {
                var n = url.lastIndexOf(".");
                url = url.substring(0, n) + size + url.substring(n);
            }
            imgUrl += `${url} ${width}w ${h.toFixed(0)}h, `
        }
    })

    return imgUrl.slice(0, imgUrl.length - 2)
}

window._usfCollection = {};
var usfAssetUrl = "//cdn.shopify.com/s/files/1/1745/2567/t/69/assets/";

var _usfProductLabels = `
<template v-if="_globalSettings.product_grid_label">
   <div v-if="isSoldOut && usf.settings.search.showSoldOut" class="product__label label label--light">
      <p class="product__label-text label__text" v-html="loc.soldOut"></p>
   </div>
   <div v-else-if="hasCustomeLabel(product)" class="product__label label label--brand">
      <p class="product__label-text label__text" v-html="_globalSettings.product_grid_label_title"></p>
   </div>
   <div v-else-if="hasDiscount && usf.settings.search.showSale" class="product__label label label--brand">
      <p v-if="_globalSettings.product_grid_label_sale_style == 'text'" class="product__label-text label__text" v-html="loc.sale"></p>
      <p v-else class="product__label-text label__text" v-html="priceVaries && !product.selectedVariantId ? _usfMinSalePercent(selectedVariantForPrice,minDiscountedPrice) :  '-' + salePercent + '%'"></p>
   </div>
   <div v-else-if=" _globalSettings.product_grid_label_new && usfNewLabel(product.date)" class="product__label label label--brand">
      <p class="product__label-text label__text" v-html="_usfNew"></p>
   </div>
</template>
`;

var _usfProductPrice = `
<template v-if="_globalSettings.product_grid_price">
   <p class="product__price h5">
      <span v-if="isSoldOut" class="product__price-price product__price-price--sold" v-html="loc.soldOut"></span>
      <template v-else-if="hasDiscount">
         <span class="product__price-price product__price-price--sale">
            <span v-if="priceVaries && !product.selectedVariantId" v-html="loc.from"></span>
            <span class="money" v-html="priceVaries && !product.selectedVariantId ? displayMinDiscountedPrice : displayDiscountedPrice"></span>
         </span>
         <strike class="product__price-cross"><span class="money" v-html="displayPrice"></span></strike>
      </template>
      <span v-else class="product__price-price">
         <span v-if="priceVaries && !product.selectedVariantId" v-html="loc.from"></span>
         <span class="money" v-html="priceVaries && !product.selectedVariantId ? displayMinPrice : displayPrice"></span>
      </span>
   </p>
</template>

`;
var _usfFilterBodyTemplate = /*inc_begin_filter-body*/
`<!-- Range filter -->
<div v-if="isRange" class="usf-facet-values usf-facet-range">
    <!-- Range inputs -->
    <div class="usf-slider-inputs usf-clear">
        <span class="usf-slider-input__from">
            <span class="usf-slider-input__prefix" v-html="facet.sliderPrefix" v-if="facet.showSliderInputPrefixSuffix"></span>
            <input :readonly="!hasRangeInputs" :value="rangeConverter(range[0]).toFixed(rangeDecimals)" @change="e => onRangeInput(e, range[0], 0)">
            <span class="usf-slider-input__suffix" v-html="facet.sliderSuffix" v-if="facet.showSliderInputPrefixSuffix"></span>
        </span>
        <span class="usf-slider-div">-</span>
        <span class="usf-slider-input__to">
            <span class="usf-slider-input__prefix" v-html="facet.sliderPrefix" v-if="facet.showSliderInputPrefixSuffix"></span>
            <input :readonly="!hasRangeInputs" :value="rangeConverter(range[1]).toFixed(rangeDecimals)" @change="e => onRangeInput(e, range[1], 1)">
            <span class="usf-slider-input__suffix" v-html="facet.sliderSuffix" v-if="facet.showSliderInputPrefixSuffix"></span>
        </span>
    </div>
	<!-- See API reference of this component at https://docs.sobooster.com/search/storefront-js-api/slider-component -->
    <usf-slider :color="facet.sliderColor" :symbols="facet.sliderValueSymbols" :prefix="facet.sliderPrefix" :suffix="facet.sliderSuffix" :min="facet.min" :max="facet.max" :pips="facet.range[0]" :step="facet.range[1]" :decimals="rangeDecimals" :value="range" :converter="rangeConverter" @input="onRangeSliderInput" @change="onRangeSliderChange"></usf-slider>
</div>
<!-- List + Swatch filter -->
<div v-else ref="values" :class="'usf-facet-values usf-scrollbar usf-facet-values--' + facet.display + (facet.navigationCollections ? ' usf-navigation' : '') + (facet.valuesTransformation ? (' usf-' + facet.valuesTransformation.toLowerCase()) : '') + (facet.circleSwatch ? ' usf-facet-values--circle' : '')" :style="!usf.isMobileFilter && facet.maxHeight ? { maxHeight: facet.maxHeight } : null">
    <!-- Filter options -->                
    <usf-filter-option v-for="o in visibleOptions" :facet="facet" :option="o" :key="o.id ? o.id : o.label+'_'+o.min+'_'+o.max"></usf-filter-option>
</div>

<!-- More -->
<div v-if="isMoreVisible" class="usf-more" @click="onShowMore" v-html="loc.more"></div>`
/*inc_end_filter-body*/;

var _usfSearchResultsSkeletonItemTpl = `
<div v-if="view === 'grid'" class="usf-sr-product grid__item usf-skeleton"  :class="['o-layout__item u-1/' + _sectionSettings.grid_mobile,_gridItemWidth]" >
    <div class="grid-view-item" v-if="true">
        <div class="usf-img"></div>
        <div class="usf-meta">            
        </div>
    </div>
</div>
<div class="usf-sr-product usf-skeleton" v-else>
    <!-- Image column -->
    <div class="usf-img-column">
        <div class="usf-img"></div>
    </div>

    <!-- Info column -->
    <div class="usf-info-column">
        <div class="usf-title"></div>
        <div class="usf-vendor"></div>
        <div class="usf-price-wrapper"></div>
    </div>
</div>
`;

var _usfSearchResultsSummaryTpl = /*inc_begin_search-summary*/
`<span class="usf-sr-summary" v-html="loader === true ? '&nbsp;' : usf.utils.format(term ? loc.productSearchResultWithTermSummary : loc.productSearchResultSummary, result.total, usf.utils.encodeHtml(term))"></span>`
/*inc_end_search-summary*/;

var _usfSearchResultsViewsTpl = /*inc_begin_search-views*/
`<div class="usf-views">
    <button class="usf-view usf-btn usf-icon usf-icon-grid" aria-label="Grid view" :class="{'usf-active': view === 'grid'}" @click.prevent.stop="onGridViewClick"></button>
    <button class="usf-view usf-btn usf-icon usf-icon-list" aria-label="List view" :class="{'usf-active': view === 'list'}" @click.prevent.stop="onListViewClick"></button>
</div>`
/*inc_end_search-views*/;

var _usfSearchResultsSortByTpl = /*inc_begin_search-sortby*/
`<usf-dropdown :placeholder="loc.sort" :value="sortBy" :options="sortByOptions" @input="onSortByChanged"></usf-dropdown>`
/*inc_end_search-sortby*/;

usf.templates = {
    // application
    app: /*inc_begin_app*/
`<div id="usf_container" class="usf-zone usf-clear" :class="{'usf-filters-horz': usf.settings.filters.horz}">
    <template v-if="hasFilters">
        <usf-filters class="usf-sr-filters"></usf-filters>
    </template>
    <usf-sr></usf-sr>
</div>`
/*inc_end_app*/,
    searchResults: `
<div class="usf-sr-container" :class="{'usf-no-facets': noFacets, 'usf-empty': !loader && !hasResults, 'usf-nosearch': !showSearchBox}">
    <!-- Search form -->
    <form v-if="showSearchBox" action="/search" method="get" role="search" class="usf-sr-inputbox">
        <button type="submit" class="usf-icon usf-icon-search usf-btn"></button>
        <input name="q" autocomplete="off" ref="searchInput" v-model="termModel">
        <button v-if="termModel" class="usf-remove usf-btn" @click.prevent.stop="clearSearch"></span>
    </form>

    <div class="usf-sr-config" v-if="usf.isMobile">
        <div class="usf-sr-config__mobile-filters-wrapper">
            <div class="usf-filters" :class="{'usf-has-filters': !!facetFilters}" @click="onMobileToggle">
                <button class="usf-btn" v-html="loc.filters"></button>
            </div>
            ` + _usfSearchResultsSortByTpl + `
        </div>
        
        ` + _usfSearchResultsSummaryTpl + _usfSearchResultsViewsTpl + `
    </div>
    <div class="usf-sr-config" v-else>
        ` + _usfSearchResultsViewsTpl + _usfSearchResultsSummaryTpl + _usfSearchResultsSortByTpl + `
    </div>

    <usf-sr-banner v-if="result && result.extra && result.extra.banner && !result.extra.banner.isBottom" :banner="result.extra.banner"></usf-sr-banner>

    <!-- Load previous -->
    <div id="usf-sr-top-loader" :class="{'usf-with-loader':loader === 'prev'}" v-if="(loader === 'prev' || itemsOffset) && loader !== true && hasResults && usf.settings.search.more !== 'page'"></div>

    <div :class="(view === \'grid\' ? _usfGridWrapClass  : \'list-view-items\') + \' usf-results usf-\' + view">
        <template v-if="loader===true">` + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl +
        `</template>
        <template v-else>
            <template v-if="hasResults">
                <template v-if="view === 'grid'">
                    <template v-for="p in result.items"><usf-sr-griditem :product="p" :result="result" :key="p.id"></usf-sr-griditem></template>
                </template>
                <template v-else>
                    <template v-for="p in result.items"><usf-sr-listitem :product="p" :result="result" :key="p.id"></usf-sr-listitem></template>
                </template>
            </template>
            <template v-else>
                <!-- Empty result -->
                <div class="usf-sr-empty">
                    <div class="usf-icon"></div>
                    <span v-html="term ? usf.utils.format(loc.productSearchNoResults, usf.utils.encodeHtml(term)) : loc.productSearchNoResultsEmptyTerm"></span>
                    <button v-if="facetFilters" class="usf-btn usf-btn-action" v-html="loc.clearAllFilters" @click="usf.queryRewriter.removeAllFacetFilters"></button>
                </div>
            </template>
        </template>
    </div>

    <usf-sr-banner v-if="result && result.extra && result.extra.banner && result.extra.banner.isBottom" :banner="result.extra.banner"></usf-sr-banner>

    <!-- Paging & load more -->
    <div class="usf-sr-paging" v-if="loader !== true">
        <div class="usf-sr-more" v-if="hasResults && usf.settings.search.more === 'more'">
            <div class="usf-title" v-html="usf.utils.format(loc.youHaveViewed, itemsLoaded, result.total)"></div>
            <div class="usf-progress">
                <div :style="{width: (itemsLoaded * 100 / result.total) + '%'}"></div>
            </div>
            <button v-if="itemsLoaded < result.total" class="usf-load-more" :class="{'usf-with-loader': loader === 'more'}" @click="onLoadMore"><span v-html="loc.loadMore"></span></button>
        </div>
        <usf-sr-pages v-else-if="hasResults && usf.settings.search.more === 'page'" :page="page" :pages-total="pagesTotal" :pages-to-display="4" :side-pages-to-display="1"></usf-sr-pages>
        <div class="usf-sr-loader usf-with-loader" v-else-if="loader === 'more'"></div>
    </div>
</div>
`,
    searchResultsGridViewItem: `
<div :class="['o-layout__item u-1/' + _sectionSettings.grid_mobile,_gridItemWidth]" :product-selector="product.id" :data-usf-pid="product.id">
   <div :class="_getGridItemClass(this)" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave" >
      <!--labels-->
      `+ _usfProductLabels + `
      <!--end labels-->
      
      <div class="product-top">
         <a :href="productUrl" class="product-link js-product-link usf-sr-product__image-container" :title="product.title" tabindex="-1">
            <div class="product__media" :class="{' product__media--hover': _globalSettings.product_grid_second_hover && hoverImage}">
               <div :class="'o-ratio o-ratio--' + _productRatio" :style="_globalSettings.product_grid_image_size == 'natural' ? 'padding-bottom:' + 100/_usfGetImageRatio(selectedImage) + '%;' : ''">
                  <div class="o-ratio__content">
                     <div class="theme-spinner"></div>
                     <!--second img-->
                     <img  v-if="_globalSettings.product_grid_second_hover && hoverImage"   class="product__img-hover"
                                :src="hoverImageUrl"
                                :srcset="_usfGetImageUrls(scaledHoverImageUrl)"
                                sizes="100vw"
                                width="300"
                                 :height="300/_usfGetImageRatio(hoverImage)"
                            :alt="hoverImage.alt"
                                loading="lazy"
                            />
                     <!--end second img-->
                        <img
                            class="product__img"
                            :src="selectedImageUrl"
                            :srcset="_usfGetImageUrls(scaledSelectedImageUrl)"
                            sizes="100vw"
                            width="300"
                            :height="300/_usfGetImageRatio(selectedImage)"
                            :alt="selectedImage.alt"
                            loading="lazy" 
                        />                  </div>
               </div> 
                <!-- product image extra -->
                <!--<usf-plugin name="searchResultsProductCart" :data="pluginData"></usf-plugin>-->

                <!-- Wishlist -->
                <usf-plugin name="searchResultsProductWishList" :data="pluginData"></usf-plugin>
                <!-- Labels -->
                <usf-plugin name="searchResultsProductLabel" :data="pluginData"></usf-plugin>
            </div>

                <usf-plugin name="searchResultsProductPreview" :data="pluginData"></usf-plugin>

         </a>
         <!--quick buy-->
         <div v-if="_globalSettings.product_grid_quick_buy != 'disabled'" :class="'product-btn product-btn--' + _globalSettings.product_grid_quick_buy">
            <a v-if="isSoldOut" :href="productUrl" class="c-btn c-btn--full c-btn--light c-btn--small-tab product-btn__btn" v-html="loc.soldOut"></a>
            <a v-else-if="product.variants.length > 1" :href="productUrl" class="c-btn c-btn--full c-btn--primary c-btn--arrow c-btn--small-tab product-btn__btn" v-html="loc.chooseOptions"></a>
            <form v-else method="post" :action="usf.platform.addToCartUrl" :id="'product_form_' + product.id" accept-charset="UTF-8" class="js-product-form" enctype="multipart/form-data">
                <input type="hidden" name="form_type" value="product">
                <input type="hidden" name="utf8" value="✓">
                <input type="hidden" name="id" :value="selectedVariantForPrice.id">
                <button type="submit" name="add" class="c-btn c-btn--full c-btn--plus c-btn--primary usf-add-to-cart-btn c-btn--small-tab product-btn__btn js-product-add" @click.prevent.stop="_usfAddToCart">
                    <span class="js-product-add-text usf-label" v-html="loc.addToCart"></span>
                </button>
            </form>
        </div>
        <!--end quick buy-->
      </div>
      <a :href="productUrl" class="product-link js-product-link" :title="product.title">
         <div class="product__details">
            <h3 class="product__title h4" v-html="product.title"></h3>
            
            <h4 v-if="_globalSettings.product_grid_vendor && usf.settings.search.showVendor" class="product__vendor h6" v-html="product.vendor"></h4>

            <div class="product__details__hover">
               `+ _usfProductPrice + `
               <!--product swatch-->
               <div v-if="_globalSettings.product_grid_swatch" class="product__swatch">
                  <ul class="product__swatch__items o-list-inline" v-html="swatchLists(product,productUrl)"></ul>
               </div>
               <!--end product swatch-->
                <!-- Swatchs-->
                <usf-plugin name="searchResultsProductSwatch" :data="pluginData"></usf-plugin>
               <!-- Product review -->
               <usf-plugin v-if="_globalSettings.product_reviews && _globalSettings.product_grid_reviews" name="searchResultsProductReview" :data="pluginData"></usf-plugin>
            </div>
         </div>
      </a>
   </div>
</div>

`,

    // Search result pages
    searchResultsPages: `
<div class="pagination text-center"><div class="pagination__items">
    <template v-for="e in elements">
        <span v-if="e.type === 'prev'" class="prev">
            <a href="javascript:void(0)" :title="loc.prevPage" @click="onPrev"><i class="icon icon--left-t"></i></a>
        </span>
        <span v-else-if="e.type === 'dots'" class="deco">…</span>
        <span v-else-if="e.type === 'page' && e.current" class="page current">{{e.page}}</span>
        <span v-else-if="e.type === 'page' && !e.current" class="page"><a href="javascript:void(0)" @click="ev=>onPage(e.page,ev)" :title="usf.utils.format(loc.gotoPage,e.page)">{{e.page}}</a></span>
        <span v-else-if="e.type === 'next'" class="next">
            <a href="javascript:void(0)" :title="loc.nextPage" @click="onNext"><i class="icon icon--right-t"></i></a>
        </span>
    </template>
</div></div>
`,

    searchResultsListViewItem: /*inc_begin_search-list-item*/
`<a class="usf-sr-product" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave" :href="productUrl" :data-usf-pid="product.id">
    <!-- Image column -->
    <div class="usf-img-column">
        <!-- product image -->
        <div class="usf-img-wrapper usf-sr-product__image-container" :class="{'usf-has-second-img': hoverImage}">
            <div class="usf-main-img lazyload" :data-bgset="_usfGetScaledImageUrl(scaledSelectedImageUrl)" :style="{'background-image': 'url(' + getSelectedImageUrl('600') + ')'}"></div>
            <span class="usf-img-loader"></span>
            <template v-if="hoverImage">
                <div class="usf-second-img lazyload" :data-bgset="_usfGetScaledImageUrl(scaledHoverImageUrl)" :style="{'background-image': 'url(' + getHoverImageUrl('600') + ')'}"></div>
                <span class="usf-img-loader"></span>
            </template>
            <!-- product image extra -->
            <usf-plugin name="searchResultsProductPreview" :data="pluginData"></usf-plugin>
            <usf-plugin name="searchResultsProductCart" :data="pluginData"></usf-plugin>
            
            <div v-if="isSoldOut && usf.settings.search.showSoldOut" class="usf-badge"><span v-html="loc.soldOut"></span></div>
            <div v-else-if="hasDiscount && usf.settings.search.showSale" class="usf-badge usf-sale-badge"><span v-html="loc.sale"></span></div>
        </div>
    </div>

    <!-- Info column -->
    <div class="usf-info-column">
        <div class="usf-title" v-html="product.title"></div>
        <div class="usf-vendor" v-if="usf.settings.search.showVendor" v-html="product.vendor"></div>

        <!-- price -->
        <usf-plugin name="searchResultsProductPrice" :data="pluginData"></usf-plugin>
        <div class="usf-price-wrapper" :class="{'usf-price--sold-out': isSoldOut}" v-if="!usf.plugins.lastRenderResult" :data-variant-id="product.selectedVariantId">
            <span class="usf-price" :class="{'usf-has-discount': hasDiscount}" v-html="displayPrice"></span>
            <span class="usf-discount" v-if="hasDiscount" v-html="displayDiscountedPrice"></span>
            <span v-if="hasDiscount" class="usf-price-savings" v-html="loc.save + ' ' + salePercent + '%'"></span>
        </div>
        <div class="usf-description"></div>
    </div>
</a>`
/*inc_end_search-list-item*/,
    // AddToCart Plugin 


    addToCartPlugin: ``
    ,
    // Preview Plugin
    previewPlugin: /*inc_begin_preview-plugin*/
`<div class="usf-sr-preview" :class="['usf-sr-' + settings.iconPosition]" @click.prevent.stop="onShowModal">
    <span class="usf-icon usf-icon-eye"></span>
</div>`
/*inc_end_preview-plugin*/,
    previewPluginModal: /*inc_begin_preview-modal*/
`<div><div class="usf-backdrop"></div><div class="usf-preview__wrapper usf-zone"><div class="usf-preview__container">
    <div class="usf-preview">
        <!-- Close button -->
        <div class="usf-remove" @click="onClose"></div>

        <!-- Body content -->
        <div class="usf-preview__body">
            <!-- left - images of product -->
            <div class="usf-preview__content-left">
                <!-- Big image -->
                <div class="usf-preview__image-slider">
                    <div type="button" title="Prev" class="usf-preview__image-slider__btn usf-prev usf-icon usf-icon-up" @click="onPrevImage(0)" v-if="showBigImageNav"></div>

                    <div class="usf-preview__image-slider__track">
                        <div v-for="i in images" class="usf-preview__image-wrapper" :class="{'usf-active': image === i}"">
                            <div v-if="image === i" class="usf-preview__image lazyload" :data-bgset="usf.platform.getImageUrl(i.url,1024)" :style="'background-image:url('+usf.platform.getImageUrl(i.url, 1024)+')'"></div>
                            <span class="usf-img-loader"></span>
                        </div>
                    </div>

                    <div type="button" title="Next" class="usf-preview__image-slider__btn usf-next usf-icon usf-icon-up" @click="onNextImage(0)" v-if="showBigImageNav"></div>

                    <ul class="usf-preview__image-slider__dots" v-if="showImageIndices && false">
                        <li :class="{'active':i===image}" v-for="(i,index) in images"  @click="onThumbClick(i)"><button type="button">{{index+1}}</button></li>
                    </ul>
                </div>

                <!-- Thumbnails -->
                <div class="usf-preview__thumbs" v-if="showThumbs">
                    <div class="usf-preview__thumbs-inner">
                        <span v-for="i in images" class="usf-preview__thumb" :class="{'usf-active': image === i}" @click="onThumbClick(i)"></span>
                    </div>
                </div>

                <!-- Badges -->
                <div class="usf-preview__badge usf-preview__badge-sale" v-if="hasDiscount" v-html="loc.sale"></div>
            </div>

            <!-- right - info of the product -->
            <div class="usf-preview__content-right usf-scrollbar">
                <div class="usf-preview__content-summary">
                    <!-- Product title -->
                    <h1 class="usf-preview__title"><a :href="productUrl" v-html="product.title"></a></h1>

                    <!-- Vendor -->
                    <div class="usf-preview__vendor" v-html="product.vendor" v-if="usf.settings.search.showVendor"></div>

                    <!--Prices -->
                    <div class="usf-preview__price-wrapper" :class="{'price--sold-out': isSoldOut}">
                        <span class="usf-price" :class="{'usf-has-discount': hasDiscount}" v-html="usf.utils.getDisplayPrice(selectedVariant.compareAtPrice || selectedVariant.price)"></span>
                        <span v-if="hasDiscount" class="usf-discount" v-html="usf.utils.getDisplayPrice(selectedVariant.price)"></span>

                        <div v-if="false" class="price__badges price__badges--listing">
                            <span class="price__badge price__badge--sale" aria-hidden="true" v-if="hasDiscount && usf.settings.search.showSale">
                                <span v-html="loc.sale"></span>
                            </span>
                            <span class="price__badge price__badge--sold-out" v-if="isSoldOut && usf.settings.search.showSoldOut">
                                <span v-html="loc.soldOut"></span>
                            </span>
                        </div>
                    </div>

                    <!-- Description -->
                    <p class="usf-preview__description" :class="{'usf-with-loader':description===undefined}" v-html="description"></p>

                    <!-- Add to cart form -->
                    <form method="post" enctype="multipart/form-data" :action="usf.platform.addToCartUrl" @submit="_usfAddToCart">
                        <!-- variant ID -->
                        <input type="hidden" name="id" :value="selectedVariant.id" />

                        <!-- Options -->
                        <template v-for="(o,index) in product.options">
                            <usf-preview-modal-option :option="o" :index="index"></usf-preview-modal-option>
                        </template>

                        <!-- add to card button -->
                        <div class="usf-preview__field">                            
                            <div class="usf-flex usf-preview__add-to-cart">
                                <usf-num-input v-model="quantity" name="quantity" :disabled="!hasAvailableVariant" :min="1" :max="available" />
                                <button :title="!hasAvailableVariant ? loc.selectedVariantNotAvailable : ''" :disabled="!hasAvailableVariant" type="submit" name="add" class="usf-add-to-cart-btn" :class="{ 'usf-disabled': !hasAvailableVariant}">
                                    <span class="usf-label" v-html="loc.addToCart"></span>
                                </button>
                            </div>
                        </div>
                    </form>

                    <!-- See details link -->
                    <a class="usf-preview__link" :href="productUrl" v-html="loc.seeFullDetails"></a>
                </div>
            </div>
        </div>
    </div>
</div></div></div>`
/*inc_end_preview-modal*/,

    searchResultsBanner: `
<div class="usf-sr-banner">
    <a :href="banner.url || 'javascript:void(0)'" :alt="banner.description">
        <img :src="banner.mediaUrl" style="max-width:100%">
    </a>
</div>
`,

    ////////////////////////
    // Filter templates
    // facet filters breadcrumb
    filtersBreadcrumb: /*inc_begin_filters-breadcrumb*/
`<div v-if="usf.settings.filterNavigation.showFilterArea && root.facetFilters && root.facets && facetFilterIds.length" class="usf-refineby">
    <!-- Breadcrumb Header -->
    <div class="usf-title usf-clear">
        <span class="usf-pull-left usf-icon usf-icon-equalizer"></span>
        <span class="usf-label" v-html="loc.filters"></span>

        <!-- Clear all -->
        <button class="usf-clear-all usf-btn" v-html="loc.clearAll" @click.prevent.stop="root.removeAllFacetFilters" :aria-label="loc.clearAllFilters"></button>
    </div>

    <!-- Breadcrumb Values -->
    <div class="usf-refineby__body">
        <template v-for="facetId in facetFilterIds" v-if="(facet = root.facets.find(fc => fc.id === facetId)) && (f = root.facetFilters[facetId])">
            <template v-for="queryValStr in f[1]">
                <div class="usf-refineby__item usf-pointer usf-clear" @click.prevent.stop="root.removeFacetFilter(facetId, queryValStr)">
                    <button class="usf-btn"><span class="usf-filter-label" v-html="facet.title + ': '"></span><b v-html="root.formatBreadcrumbLabel(facet, f[0], usf.utils.encodeHtml(queryValStr))"></b></button><span class="usf-remove"></span>
                </div>
            </template>
        </template>
    </div>
 </div>`
 /*inc_end_filters-breadcrumb*/,

    // facet filters    
    filters: /*inc_begin_filters*/
// Vert & Horz modes have different render order
`<div class="usf-facets usf-no-select usf-zone" :class="{'usf-facets--mobile':usf.isMobileFilter}">
<!-- Mobile view -->
<template v-if="usf.isMobile">
    <div class="usf-close" @click="onMobileBack(1)"></div>
    <div class="usf-facets-wrapper">
        <!-- Header. shows 'Filters', facet name, etc. -->
        <div class="usf-header">
            <!-- Single facet mode -->
            <template v-if="isSingleFacetMode">
                <div class="usf-title" @click="onMobileBack(0)" v-html="facets[0].title"></div>
                <div v-if="facetFilters" class="usf-clear" @click="removeAllFacetFilters" v-html="loc.clear"></div>
            </template>

            <!-- When a filter is selected -->
            <template v-else-if="mobileSelectedFacet">
                <div class="usf-title usf-back" @click="onMobileBack(0)" v-html="mobileSelectedFacet.title"></div>
                <div v-if="facetFilters && facetFilters[mobileSelectedFacet.id]" class="usf-clear" @click="removeFacetFilter(mobileSelectedFacet.id)" v-html="loc.clear"></div>
                <div v-else-if="mobileSelectedFacet.multiple" class="usf-all" @click="selectFacetFilter(mobileSelectedFacet)" v-html="loc.all"></div>
            </template>

            <!-- When no filter is selected -->
            <template v-else>
                <div class="usf-title" @click="onMobileBack(0)" v-html="loc.filters"></div>
                <div v-if="facetFilters" class="usf-clear" @click="removeAllFacetFilters" v-html="loc.clearAll"></div>
            </template>
        </div>

        <div class="usf-body">
            <!-- Desktop-like filter in mobile -->
            <template v-if="usf.settings.filters.desktopLikeMobile">
                <usf-filter-breadcrumb></usf-filter-breadcrumb>
                
                <!-- Facets body -->
                <div class="usf-facets__body">
                    <usf-filter :facet="f" :key="f.id" v-for="f in facets"></usf-filter>
                </div>
            </template>
            
            <!-- Mobile filter -->
            <template v-else>
                <!-- List all filter options, in single facet mode -->
                <usf-filter v-if="isSingleFacetMode" :facet="facets[0]"></usf-filter>

                <!-- List all filter options, when a filter is selected -->
                <usf-filter v-else-if="mobileSelectedFacet" :facet="mobileSelectedFacet"></usf-filter>

                <!-- List all when there are more than one facet -->
                <template v-else v-for="f in facets">
                    <template v-if="canShowFilter(f)">
                        <div :key="f.id" class="usf-facet-value" @click="onMobileSelectFacet(f)">
                            <span class="usf-title" v-html="f.title"></span>
                            <div v-if="(selectedFilterOptionValues = facetFilters && (ff = facetFilters[f.id]) ? ff[1] : null)" class="usf-dimmed">
                                <span v-for="cf in selectedFilterOptionValues" v-html="formatBreadcrumbLabel(f, f.facetName, cf)"></span>
                            </div>
                        </div>
                    </template>
                </template>
            </template>
        </div>

        <!-- View items -->
        <div class="usf-footer">
            <div @click="onMobileBack(1)" v-html="loc.viewItems"></div>
        </div>
    </div>
</template>

<!-- Desktop view -->
<template v-else>
    <usf-filter-breadcrumb></usf-filter-breadcrumb>
    <!-- Filters Loader -->
    <div v-if="!facets" class="usf-facets__first-loader">
        <template v-for="i in 3">
            <div class="usf-facet"><div class="usf-title usf-no-select"><span class="usf-label"></span></div>
                <div v-if="!usf.settings.filters.horz" class="usf-container"><div class="usf-facet-values usf-facet-values--List"><div class="usf-relative usf-facet-value usf-facet-value-single"><span class="usf-label"></span><span class="usf-value"></span></div><div class="usf-relative usf-facet-value usf-facet-value-single"><span class="usf-label"></span><span class="usf-value"></span></div></div></div>
            </div>
        </template>
    </div>
    <!-- Facets body -->
    <div v-else class="usf-facets__body">
        <usf-filter :facet="f" :key="f.id" v-for="f in facets"></usf-filter>
    </div>
</template>
</div>`
/*inc_end_filters*/,

    // facet filter item
    filter: /*inc_begin_filter*/
`<div v-if="canShow" class="usf-facet" :class="{'usf-collapsed': collapsed && !usf.isMobileFilter, 'usf-has-filter': isInBreadcrumb}">
    <!-- Mobile filter -->
    <div v-if="usf.isMobileFilter" class="usf-container">
        <!-- Search box -->
        <input v-if="hasSearchBox" class="usf-search-box" :aria-label="loc.filterOptions" :placeholder="loc.filterOptions" :value="term" @input="v => term = v.target.value">

        <!-- Values -->
        ` + _usfFilterBodyTemplate +
    `</div>

    <!-- Desktop filter -->
    <template v-else>
        <!-- Filter title -->
        <div class="usf-clear">
            <div class="usf-title usf-no-select" @click.prevent.stop="onExpandCollapse">
                <button class="usf-label usf-btn" v-html="facet.title" :aria-label="usf.utils.format(loc.filterBy,facet.title)" :aria-expanded="!collapsed"></button>
                <usf-helptip v-if="facet.tooltip" :tooltip="facet.tooltip"></usf-helptip>            
                <!-- 'Clear all' button to clear the current facet filter. -->
                <button v-if="isInBreadcrumb" class="usf-clear-all usf-btn" :title="loc.clearFilterOptions" :aria-label="usf.utils.format(loc.clearFiltersBy,facet.title)" @click.prevent.stop="onClear" v-html="loc.clear"></button>
                <span class="usf-pm"></span>
            </div>
        </div>

        <!-- Filter body -->
        <div class="usf-container">
            <!-- Search box -->
            <input v-if="hasSearchBox" class="usf-search-box" :placeholder="loc.filterOptions" :value="term" @input="v => term = v.target.value">

            ` + _usfFilterBodyTemplate +
        `
        </div>
    </template>
</div>`
/*inc_end_filter*/,

    // facet filter option
    filterOption: /*inc_begin_filter-option*/
`<div v-if="children" :class="(isSelected ? 'usf-selected ' : '') + ' usf-relative usf-facet-value usf-facet-value-single usf-with-children' + (collapsed ? ' usf-collapsed' : '')">
    <!-- option label -->
    <button class="usf-pm usf-btn" aria-label="Toggle children" v-if="children" @click.prevent.stop="onToggleChildren"></button>
    <button class="usf-label usf-btn" v-html="label" @click.prevent.stop="onToggle"></button>

    <!-- product count -->
    <span v-if="!(!usf.settings.filterNavigation.showProductCount || (swatchImage && !usf.isMobileFilter)) && option.value !== undefined" class="usf-value">{{option.value}}</span>    

    <div class="usf-children-container" v-if="children && !collapsed">
        <button :class="'usf-child-item usf-btn usf-facet-value' + (isChildSelected(c) ? ' usf-selected' : '')" v-for="c in children" v-html="getChildLabel(c)" @click="onChildClick(c)"></button>
    </div>
</div>
<button v-else :class="(isSelected ? 'usf-selected ' : '') + (swatchImage ? ' usf-facet-value--with-background' : '') + ' usf-btn usf-relative usf-facet-value usf-facet-value-' + (facet.multiple ? 'multiple' : 'single')" :title="isSwatch || isBox ? label + ' (' + option.value + ')' : undefined" :style="usf.isMobileFilter ? null : swatchStyle" @click.prevent.stop="onToggle">
    <!-- checkbox -->
    <div v-if="!isBox && !isSwatch && facet.multiple" :class="'usf-checkbox' + (isSelected ? ' usf-checked' : '')">
        <span class="usf-checkbox-inner"></span>
    </div>

    <!-- swatch image in mobile -->
    <div v-if="swatchImage && usf.isMobileFilter" class="usf-mobile-swatch" :style="swatchStyle"></div>

    <!-- option label -->
    <span class="usf-label usf-btn" v-html="label"></span>
    
    <!-- product count -->
    <span v-if="!(!usf.settings.filterNavigation.showProductCount || (swatchImage && !usf.isMobileFilter)) && option.value !== undefined" class="usf-value">{{option.value}}</span>
</button>`
/*inc_end_filter-option*/,



    // Instant search popup
    instantSearch: /*inc_begin_instantsearch*/
`<div :class="'usf-popup usf-zone usf-is usf-is--compact usf-is--' + position + (shouldShow ? '' : ' usf-hide') + (isEmpty ? ' usf-empty' : '') + (hasProductsOnly ? ' usf-is--products-only' : '') + (firstLoader ? ' usf-is--first-loader': '')"  :style="usf.isMobile ? null : {left: this.left + 'px',top: this.top + 'px',width: this.width + 'px'}">
    <!-- Mobile search box -->
    <div v-if="usf.isMobile">
        <form class="usf-is-inputbox" :action="searchUrl" method="get" role="search">
            <span class="usf-icon usf-icon-back usf-close" @click="usf.utils.hideInstantSearch"></span>
            <input name="q" autocomplete="off" ref="searchInput" :value="term" @input="onSearchBoxInput">
            <span class="usf-remove" v-if="term" @click="onClear"></span>
        </form>
    </div>

    <!-- First loader -->
    <div class="usf-is-first-loader" v-if="firstLoader">
        <div class="usf-clear">
            <div class="usf-img"></div>
            <div class="usf-title"></div>
            <div class="usf-subtitle"></div>
        </div>
        <div class="usf-clear">
            <div class="usf-img"></div>
            <div class="usf-title"></div>
            <div class="usf-subtitle"></div>
        </div>
        <div class="usf-clear">
            <div class="usf-img"></div>
            <div class="usf-title"></div>
            <div class="usf-subtitle"></div>
        </div>
    </div>

    <!-- All JS files loaded -->
    <template v-else>
        <!-- Empty view -->
        <div v-if="isEmpty" class="usf-is-no-results">
            <div style="background:url('//cdn.shopify.com/s/files/1/0257/0108/9360/t/85/assets/no-items.png?t=2') center no-repeat;min-height:160px"></div>
            <div v-html="usf.utils.format(loc.noMatchesFoundFor, usf.utils.encodeHtml(term))"></div>
        </div>
        <template v-else>
            <!-- Body content -->
            <div class="usf-is-content">
                <!-- Products -->
                <div class="usf-is-matches usf-is-products">
                    <div class="usf-title" v-html="queryOrTerm ? loc.productMatches : loc.trending"></div>
                    
                    <div class="usf-is-list" v-if="result.items.length">
                        <!-- Did you mean -->
                        <span class="usf-is-did-you-mean" v-html="usf.utils.format(loc.didYouMean, usf.utils.encodeHtml(term), result.query)" v-if="termDiffers"></span>

                        <!-- Product -->
                        <usf-is-item v-for="p in result.items" :product="p" :result="result" :key="p.id + '-' + p.selectedVariantId"></usf-is-item>
                    </div>
                    <div class="usf-is-list" v-else style="background:url('//cdn.shopify.com/s/files/1/0257/0108/9360/t/85/assets/no-products.png?t=2') center no-repeat;min-height:250px"></div>
                </div>

                <div class="usf-is-side">
                    <!-- Suggestions -->
                    <div class="usf-is-matches usf-is-suggestions" v-if="result.suggestions && result.suggestions.length">
                        <div class="usf-title" v-html="loc.searchSuggestions"></div>
                        <button v-for="s in result.suggestions" class="usf-is-match usf-btn" v-html="usf.utils.highlight(s, result.query)" @click="search(s)"></button>
                    </div>

                    <!-- Collections -->
                    <div class="usf-is-matches usf-is-collections" v-if="result.collections && result.collections.length">
                        <div class="usf-title" v-html="loc.collections"></div>
                        <button v-for="c in result.collections" class="usf-is-match usf-btn" v-html="usf.utils.highlight(c.title, result.query)" @click="selectCollection(c)"></button>
                    </div>

                    <!-- Pages -->
                    <div class="usf-is-matches usf-is-pages" v-if="result.pages && result.pages.length">
                        <div class="usf-title" v-html="loc.pages"></div>
                        <button v-for="p in result.pages" class="usf-is-match usf-btn" v-html="usf.utils.highlight(p.title, result.query)" @click="selectPage(p)"></button>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="usf-is-viewall">
                <button class="usf-btn" @click="search(queryOrTerm)" v-html="usf.utils.format(queryOrTerm ? loc.viewAllResultsFor : loc.viewAllResults, usf.utils.encodeHtml(queryOrTerm))"></button>
            </div>
        </template>
    </template>
</div>`
/*inc_end_instantsearch*/
    ,

    // Instant search item
    instantSearchItem:/*inc_begin_instantsearch-item*/
`<div class="usf-is-product usf-clear" @click="onItemClick">
    <!-- Image -->
    <div class="usf-img-wrapper usf-pull-left">
        <img class="usf-img" :src="selectedImageUrl" :alt="selectedImage.alt">
    </div>
    
    <div class="usf-pull-left">
        <!-- Title -->
        <button class="usf-title usf-btn" v-html="usf.utils.highlight(product.title, result.query)"></button>

        <!-- Vendor -->
        <div class="usf-vendor" v-html="product.vendor" v-if="usf.settings.search.showVendor"></div>

        <!-- Prices -->
        <div class="usf-price-wrapper">
            <span class="usf-price" :class="{ 'usf-has-discount': hasDiscount }" v-html="displayPrice"></span>
            <span v-if="hasDiscount" class="usf-discount" v-html="displayDiscountedPrice"></span>
        </div>
    </div>
</div>`
/*inc_end_instantsearch-item*/,
};

var hasCustomeLabel = function (p) {
    p.collections.filter(c => {
        if (c == _usfCollection[_globalSettings.product_grid_label_collection]) {
            return true;
        }
    });
    return false;
}

var _usfMinSalePercent = function (variant, minPrice) {
    if (minPrice == 0)
        return '-100%';
    return '-' + Math.ceil(100 - minPrice * 100 / variant.compareAtPrice) + '%';
}

var usfNewLabel = function (day) {
    var dayNow = new Date(Date.now());
    var productDate = new Date(day);
    var distance = dayNow - productDate;
    var diffDays = Math.floor(distance / (1000 * 60 * 60 * 24));

    return diffDays < _globalSettings.product_grid_label_new_days
}

var swatchLists = function (product, productUrl) {
    var html = "";

    var colorShowed = {};

    var option;
    var option_index;
    for (let i = 0; i < product.options.length; i++) {
        var o = product.options[i];
        if (o.name === 'Color' || o.name === 'Colour' || o.name === 'Farbe') {
            option_index = i;
            option = o;
            break;
        }
    }
    if (option)
        for (let i = 0; i < option.values.length; i++) {
            var imageIndex = 0;

            product.variants.filter(v => {
                if (v.options[option_index] != undefined) {
                    var optVal = option.values[i];
                    var optHandled = _usfHandlezie(optVal);
                    if (optVal == option.values[v.options[option_index]] && !colorShowed[optVal]) {
                        imageIndex = v.imageIndex;

                        colorShowed[optVal] = 1;
                        var img = product.images[imageIndex];
                        var variant_img;
                        if (!img) {
                            if (product.images.length)
                                img = product.images[0];
                            else
                                img = {
                                    url: usf.platform.emptyImage.url,
                                    width: 360,
                                    height: 260
                                };
                        }
                        var swatch_css_color = optHandled;;
                        var variantImgUrl = _usfGetOriginImgWithSize(img.url, '{width}x');
                        var bgImg = '';
                        if (_globalSettings.product_grid_swatch_image) {

                            bgImg = `background-image: url(${usfAssetUrl + optHandled}.png)`;
                            var swatch_color = optHandled.replaceAll('-', '');
                            var custom_color_var = 'swatch_color_' + swatch_color;
                            var custom_color = _colors[custom_color_var];
                            if (custom_color != undefined) {
                                swatch_css_color = custom_color
                            } else if (css_color_names.includes(swatch_color)) {
                                swatch_css_color = swatch_color
                            } else {
                                swatch_css_color = '#ddd'
                            }
                        }
                        var variantUrl = _usfAddQuery(productUrl, `variant=${v.id}`);
                        html += `<li class="product__swatch__item js-product-swatch-item o-list-inline__item" data-variant-image="${variantImgUrl}" data-variant-url="${variantUrl}" data-variant-image-width="${img.width}" data-variant-image-height="${img.height}">
                            <span class="product__swatch__graphic ${optHandled == 'white' ? ' product__swatch__graphic--white' : ''}" 
                            style="background-color: ${swatch_css_color};${bgImg}"></span>
                            <span class="u-hidden-visually">${optHandled}</span>
                        </li>`
                    }
                }
            })
        }

    return html
}

function _usfOnAddToCartSuccess(rs, formSelector) {
    window.ajaxCart && window.ajaxCart.load && ajaxCart.load();
}

function _usfMasonryLayoutFetch() {
    try {
        var $masonry = $(".o-layout--masonry");
        $masonry.masonry().masonry('destroy');
        $masonry.masonry().masonry('remove');
        theme.masonryLayout();
    } catch (e) {
        console.log(e)
    }
}
 
usf.event.add('init', function () {

    _usfImageWidths = _usfIsDynamicImage ? [180, 360, 540, 720, 900, 1080, 1296, 1512] : [usf.settings.search.imageSize];
    window._usfNew = window._usfNew || "New";
    usf.event.add(['sr_updated', 'sr_viewChanged', 'rerender'], function () {
        setTimeout(function () {
            theme.productCollSwatch();
            _usfMasonryLayoutFetch();
            window.theme && theme.animScroll && theme.animScroll();

            try{
                myAppJavaScript_cfp($);
            }catch(e){
                console.log(e)
            } 

        }, 100); 
    });

    var form_submit = document.querySelector('button.search__form-submit')
    if (form_submit) form_submit.addEventListener("click", () => {
        var js_close_mfp = document.querySelector('.js-close-mfp')
        if (js_close_mfp) js_close_mfp.click()
    });

    var input = document.querySelector('input.js-search-input') // replace with popup input selector
    var closeSearch = document.querySelector('.js-close-mfp')
    if (input)
        input.addEventListener("keyup", function (event) {
            if (event.keyCode == 13 && closeSearch) {
                input.blur()
                usf.event.raise('is_hide')
                closeSearch.click()
                var is_dom = document.querySelector('.usf-popup.usf-zone.usf-is')
                if (is_dom) is_dom.classList.add('usf-hide')
            }
        });

    // var nodes = document.head.children;
    // for (var i = 0; i < nodes.length; i++) {
    //     var n = nodes[i];
    //     if (n.href && n.href.indexOf('theme-critical.scss.css') != -1) {
    //         usfAssetUrl = n.href.split('theme-critical.scss.css')[0];
    //     }
    // }
    if (window.usf_globalSettings)
        _globalSettings = window.usf_globalSettings;
    if (window.usf_sectionSettings)
        _sectionSettings = window.usf_sectionSettings;
    if (window.usf_gridItemWidth)
        _gridItemWidth = window.usf_gridItemWidth;
    if (window.usf_productRatio)
        _productRatio = window.usf_productRatio;

    _usfGridWrapClass = `o-layout ${_globalSettings.product_grid_masonry ? ' o-layout--masonry ' : ''} ${_sectionSettings.grid == '4' ? ' o-layout--small ' : ''} ${_sectionSettings.grid_mobile == '2' ? '' : ' o-layout--small@tab-down '}`;

    _usfGetCollections();

    var searchSubmit = document.querySelector('button.search__form-submit');
    if (searchSubmit)
        searchSubmit.addEventListener('click', function () {
            var close_pp = document.querySelector('.js-close-mfp');
            if (close_pp) close_pp.click();
        });

    //close the search popup when the Enter key is pressed
    var input = document.querySelector('.js-search-input');
    if (input)
        input.addEventListener("keyup", function (event) {
            if (event.keyCode == 13) {
                var close_pp = document.querySelector('.js-close-mfp');
                if (close_pp) close_pp.click();
                document.querySelectorAll('form[action="/search"] input[type="search"]').forEach(el => el.value = input.value)
            }
        });
});
function _usfGetCollections() {
    fetch(usf.platform.baseUrl + '/collections.json', {
        method: 'get',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        },
    }).then(r => {
        return r.json();
    }).then(rs => {
        if (rs.collections && rs.collections.length) {
            rs.collections.filter(col => {
                _usfCollection[col.title] = col.id;
            })
        }
    });
}
var _colors = {
    swatch_color_black: '#111111',
    swatch_color_navy: '#132257',
    swatch_color_blue: '#0074D9',
    swatch_color_aqua: '#7FDBFF',
    swatch_color_teal: '#39CCCC',
    swatch_color_olive: '#808000',
    swatch_color_green: '#2ECC40',
    swatch_color_lime: '#01FF70',
    swatch_color_yellow: '#FFDC00',
    swatch_color_orange: '#FF851B',
    swatch_color_red: '#FF4136',
    swatch_color_fuchsia: '#F012BE',
    swatch_color_purple: '#B10DC9',
    swatch_color_maroon: '#85144B',
    swatch_color_silver: '#DDDDDD',
    swatch_color_gray: '#AAAAAA',
    swatch_color_white: '#FFFFFF',
    swatch_color_pink: '#FABEBE',
    swatch_color_brown: '#9A6324',
    swatch_color_mint: '#AAFFC3',
    swatch_color_lavender: '#E6BEFF',
    swatch_color_blue: '#1C4AEC',
    swatch_color_dovegrey: '#A5A5A5',
    swatch_color_cream: '#FFF5EE',
    swatch_color_corten: 'corten.png',
    swatch_color_jarrah: 'jarrah.png',
    swatch_color_anthracite: 'anthracite.png',
    swatch_color_anthracitegrey: 'anthracite-grey.png',
}

/* Begin theme ready code */
if(usf.settings.instantSearch.online && usf.isMobile){
    // click on search icon -> show our instant search
    var searchIcon = document.querySelector(usf.isMobile ? '.js-search-draw-icon' : '.secondary-nav__item--search .js-search-trigger');
    if(searchIcon)
        searchIcon.addEventListener('click',function(e){
            var target  = document.createElement('input');
            usf.utils.loadAndShowInstantSearch(target, true);
            usf.utils.stopEvent(e);
        });

    // still register to 'is_show' event to hide the drawer.
    usf.event.add('is_show', function () {
        setTimeout(() => {
            // close the theme search box
            var btn = document.querySelector('.mfp-close');
            if (btn)
                btn.click();
            // refocus on our input box
            usf.instantSearch.focus();
        }, 300);
    })
}
/* End theme ready code */
