import React from "react";
import dotProps from "dot-prop-immutable"
import * as selectors from "../selectors";
import * as actions from "../actions";
import * as urlUtils from "./../../common/utils/url";
import * as utils from "./../utils";
import { connect } from "react-redux";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import orderBy from "lodash/orderBy";
import ImageContainer from "./ImageContainer";
import Card from "../../common/components/layout/Card";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import ImageForm from "./ImageForm";
import find from "lodash/find";
import Select from "react-select";
import MultipleImageForm from "./MultipleImageForm";
import Gallery from "../../common/components/gallery";

const SortableItem = SortableElement(
  ({
    value,
    setEditImage,
    deleteImage,
    itemIndex,
    imageCategories,
    updateImageById,
    onClick
  }) => (
    <div className="p-2">
      <ImageContainer
        onClick={e => onClick && onClick()}
        contain
        imgUrl={urlUtils.getSmallImageLink(
          get(value, "storageInformation.publicUri"),
          "-small",
          get(value, 'colorSpace', null)
        )}
        size={`${get(value, 'width')}x${get(value, 'height')}`}
        colorSpace={get(value, 'colorSpace') !== 'sRGB' ? get(value, 'colorSpace') : ''}
        manuallyImported={get(value, 'manuallyImported')}
        >
        <div className="col d-flex justify-content-between py-1">
          <button
            onClick={() => setEditImage(value)}
            className="btn btn-primary btn-sm"
          >
            Edit
          </button>
          <button
            onClick={e => deleteImage(get(value, "id"))}
            className="btn btn-danger btn-sm"
          >
            Remove
          </button>
        </div>
        <div className="col pb-1">
          <Select
            getOptionLabel={c => c.label}
            getOptionValue={c => c.value}
            options={imageCategories}
            value={find(
              imageCategories,
              cat => cat.value === get(value, "imageCategory")
            )}
            onChange={val =>
              updateImageById(get(value, "id"), `imageCategory`, val.value)
            }
          />
        </div>
      </ImageContainer>
    </div>
  )
);

const SortableList = SortableContainer(
  ({ items, setEditImage, deleteImage, imageCategories, updateImageById, onItemClick }) => {
    return (
      <div className="d-flex flex-wrap">
        {items.map((value, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
            itemIndex={index}
            value={get(value, "values")}
            setEditImage={setEditImage}
            deleteImage={deleteImage}
            imageCategories={imageCategories}
            updateImageById={updateImageById}
            onClick={() => onItemClick && onItemClick(index)}
          />
        ))}
      </div>
    );
  }
);

class ImageManagement extends React.Component {

  state = {
    gallery: {
        opened: false,
        imageIndex: 0
    }
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    const { getImageCategories, getImagePlungeAngles, getImageFacingTypes } = this.props;
    getImageCategories();
    getImagePlungeAngles();
    getImageFacingTypes();
  }

  selectImage(imageIndex) {
      this.setState({ gallery: Object.assign({}, this.state.gallery, {
          opened: true,
          imageIndex
      })})
  }

  render() {

    const { gallery } = this.state

    const {
      tradeItem,
      imageEdit,
      imageCategories,
      imagePlungeAngles,
      imageFacingTypes,
      multipleImages,
      targetMarkets,
      retailers,
      currentImageEditIndex,
      currentImageEditChannels
    } = this.props;

    const {
      setEditImage,
      setMultipleImageForm,
      setImageProperty,
      deleteImageProperty,
      mergeImageProperty,
      updateImageById,
      createImage,
      updateImage,
      deleteImage,
      resetEditImage,
      reorderImages,
      removeMultipleImageFormItem,
      changeMultipleImageFormProperty,
      uploadButchImages,
      setTradeItemProperty
    } = this.props;
    const _imageCategories = map(imageCategories, cat => {
      return { value: cat, label: cat };
    });
    const sortedImages = orderBy(
      get(tradeItem, "imageResourceMetadatas"),
      "values.index",
      "asc"
    );

    return (
      <React.Fragment>
        {/* Actions */}
        <Card title="Image actions" sm>
          <div className="row">
            <div className="col">
              <button
                onClick={() => {
                  setMultipleImageForm();
                  setEditImage(utils.getDefaultImage(tradeItem));
                }}
                className="btn btn-secondary"
              >
                + Add image
              </button>
              <button
                onClick={() => {
                  resetEditImage();
                  setMultipleImageForm([]);
                }}
                className="btn btn-secondary ml-2"
              >
                +++ Add multiple images
              </button>
            </div>
          </div>
        </Card>
        {imageEdit &&
          !multipleImages && (
            <ImageForm
              imageEdit={imageEdit}
              currentImageEditIndex={currentImageEditIndex}
              currentImageEditChannels={currentImageEditChannels}
              targetMarkets={targetMarkets}
              retailers={retailers}
              createImage={createImage}
              updateImage={updateImage}
              imageCategories={_imageCategories}
              imagePlungeAngles={imagePlungeAngles}
              imageFacingTypes={imageFacingTypes}
              setImageProperty={setImageProperty}
              deleteImageProperty={deleteImageProperty}
              mergeImageProperty={mergeImageProperty}
              resetEditImage={resetEditImage}
              setMultipleImageForm={setMultipleImageForm}
              setTradeItemProperty={setTradeItemProperty}
            />
          )}
        {!imageEdit &&
          multipleImages && (
            <MultipleImageForm
              multipleImages={multipleImages}
              uploadButchImages={uploadButchImages}
              tradeItem={tradeItem}
              setMultipleImageForm={setMultipleImageForm}
              changeMultipleImageFormProperty={changeMultipleImageFormProperty}
              removeMultipleImageFormItem={removeMultipleImageFormItem}
            />
          )}
        <Card title="Images" sm>
          <div className="row">
            {!isEmpty(sortedImages) && (

              <React.Fragment>

                {/* Sorted images */}
                <SortableList
                  items={sortedImages}
                  axis="xy"
                  pressDelay={150}
                  onSortEnd={sortResult =>
                    reorderImages(sortResult, sortedImages)
                  }
                  setEditImage={setEditImage}
                  deleteImage={deleteImage}
                  imageCategories={_imageCategories}
                  updateImageById={updateImageById}
                  onItemClick={index => this.selectImage(index)}
                />

                {/* Gallery */}
                <Gallery
                    images={map(sortedImages, img => get(img, "values.storageInformation.publicUri"))}
                    opened={gallery.opened}
                    imageIndex={gallery.imageIndex}
                    goToImage={imageIndex => this.setState({
                        gallery: dotProps.set(gallery, 'imageIndex', imageIndex)
                    })}
                    onClose={() => this.setState({
                        gallery: dotProps.set(gallery, 'opened', false)
                    })}
                    />

              </React.Fragment>
            )}
          </div>
        </Card>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    tradeItem: selectors.getTradeItemToEdit(state),
    imageCategories: selectors.getImageCategories(state),
    imagePlungeAngles: selectors.getImagePlungeAngles(state),
    imageFacingTypes: selectors.getImageFacingTypes(state),
    imageEdit: selectors.getImageEdit(state),
    currentImageEditIndex: selectors.getEditImageIndex(state),
    currentImageEditChannels: selectors.getEditImageChannels(state),
    multipleImages: selectors.getMultipleImages(state),
    targetMarkets: selectors.getTargetMarkets(state),
    retailers: selectors.getRetailers(state),
  };
};

export default connect(
  mapStateToProps,
  actions
)(ImageManagement);
