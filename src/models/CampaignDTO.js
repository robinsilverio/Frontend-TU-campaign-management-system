export default class CampaignDTO {
    constructor(
      campaignId,
      campaignTitle,
      campaignDescText,
      campaignTermsURL,
      campaignRibbonType,
      campaignClientGroups,
      campaignStartDate,
      campaignEndDate,
      campaignFilterImageURL,
      campaignFilterOverlayText,
      campaignPromoImgURL,
      campaignPromoImgAltText,
      campaignPromoSummary,
      campaignItems,
      campaignStatus,
      campaignWebsiteURL,
      campaignWebsiteText,
      rootIndicator
    ) {
      this.campaignId = campaignId;
      this.campaignTitle = campaignTitle;
      this.campaignDescText = campaignDescText;
      this.campaignTermsURL = campaignTermsURL;
      this.campaignRibbonType = campaignRibbonType;
      this.campaignClientGroups = campaignClientGroups;
      this.campaignStartDate = campaignStartDate;
      this.campaignEndDate = campaignEndDate;
      this.campaignFilterImageURL = campaignFilterImageURL;
      this.campaignFilterOverlayText = campaignFilterOverlayText;
      this.campaignPromoImgURL = campaignPromoImgURL;
      this.campaignPromoImgAltText = campaignPromoImgAltText;
      this.campaignPromoSummary = campaignPromoSummary;
      this.campaignItems = campaignItems;
      this.campaignStatus = campaignStatus;
      this.campaignWebsiteURL = campaignWebsiteURL;
      this.campaignWebsiteText = campaignWebsiteText;
      this.rootIndicator = rootIndicator;
    }
  }
  