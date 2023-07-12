export default class CampaignDTO {
  constructor(
      campaignId,
      campaignFolderId,
      title,
      campaignUrl,
      startDate,
      endDate,
      type,
      promoDescriptionText,
      promoSummaryText,
      ribbonType,
      termsUrl,
      campaignClientGroups,
      campaignTags,
      rootIndicator,
      filterImgUrl,
      filterOverlayText,
      promoImgUrl,
      promoImgAltText,
      campaignWebsiteUrl,
      campaignWebsiteText,
      appTitle,
      appImageUrl,
      appSummary,
      relativeUrl,
      campaignItems
  ) {
    this.campaignId = campaignId;
    this.campaignFolderId = campaignFolderId;
    this.title = title;
    this.campaignUrl = campaignUrl;
    this.startDate = startDate;
    this.endDate = endDate;
    this.type = type;
    this.promoDescriptionText = promoDescriptionText;
    this.promoSummaryText = promoSummaryText;
    this.ribbonType = ribbonType;
    this.termsUrl = termsUrl;
    this.campaignClientGroups = campaignClientGroups;
    this.campaignTags = campaignTags;
    this.rootIndicator = rootIndicator;
    this.filterImgUrl = filterImgUrl;
    this.filterOverlayText = filterOverlayText;
    this.promoImgUrl = promoImgUrl;
    this.promoImgAltText = promoImgAltText;
    this.campaignWebsiteUrl = campaignWebsiteUrl;
    this.campaignWebsiteText = campaignWebsiteText;
    this.appTitle = appTitle;
    this.appImageUrl = appImageUrl;
    this.appSummary = appSummary;
    this.relativeUrl = relativeUrl;
    this.campaignItems = campaignItems;
  }
}
