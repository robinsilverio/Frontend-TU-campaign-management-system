import CampaignDTO from "@/models/CampaignDTO";
import {campaigns} from "@/store/modules/campaigns.module";

export class CampaignMapping {
    constructor(paramCampaign) {
        this.campaign = new CampaignDTO(
            paramCampaign.campaignId,
            paramCampaign.campaignFolderId,
            paramCampaign.title,
            paramCampaign.startDate,
            paramCampaign.endDate,
            paramCampaign.type,
            paramCampaign.promoDescriptionText,
            paramCampaign.promoSummaryText,
            paramCampaign.ribbonType,
            paramCampaign.termsUrl,
            paramCampaign.campaignClientGroups,
            paramCampaign.campaignTags,
            paramCampaign.rootIndicator,
            paramCampaign.filterImgUrl,
            paramCampaign.filterOverlayText,
            paramCampaign.promoImgUrl,
            paramCampaign.promoImgAltText,
            paramCampaign.campaignWebsiteUrl,
            paramCampaign.campaignWebsiteText,
            paramCampaign.appTitle,
            paramCampaign.appImageUrl,
            paramCampaign.appSummary,
            paramCampaign.relativeUrl,
            paramCampaign.campaignItems
        );
        this.checked = false;
    }
}