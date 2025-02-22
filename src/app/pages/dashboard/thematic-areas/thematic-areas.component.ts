import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-thematic-areas',
    templateUrl: './thematic-areas.component.html',
    styleUrls: ['./thematic-areas.component.scss'],
})
export class ThematicAreasComponent implements OnInit {
    areas = [
        {
            title: 'Tenure',
            descriptions: `Securing tenurial rights to territories and places underpins cultural and social security, a necessary condition for sustainable development of IPLCs across Asia`,
            color: '#83380c',
            image: `../../../assets/images/thematic-areas/dashboard-tenure.jpg`,
            displayShowMore: false,
        },
        {
            title: 'Indigenous Governance and Leadership Development',
            descriptions: `Through a combination of peer learning, systems thinking, reflection, and accompaniment, Samdhana supports communities’ right to self-determination. We support strengthening of governance and increasing capacities for leadership to help community leaders, NGOs, and other civil society leaders to reflect upon their experiences and strengthen their skills while also elevating the roles and responsibilities of local leaders. Grassroots organizations and local CSOs are supported to carry out their roles for the social and environmental movement.`,
            color: '#d27b26',
            image: `../../../assets/images/thematic-areas/dashboard-governance-leadership.jpeg`,
            displayShowMore: false,
        },
        {
            title: 'Natural Resource Governance',
            descriptions: `Integrating indigenous rights and interests into policies and programs for land and resource management; supporting IPLCs to actively plan, develop, manage and care for their natural assets to fulfill their basic needs in a way that maintains the balanced relationship between people and ecosystems.`,
            color: '#9c4715',
            image: `../../../assets/images/thematic-areas/dashboard-natural-resource-governance.jpeg`,
            displayShowMore: false,
        },
        {
            title: 'Next Generation',
            descriptions: `Focusing on youth leadership and capacity development; support for youth-led initiatives such as rights-based organizing, environmental protection, rights awareness; Supporting and creating opportunities for education and development of young people; and fostering inter-generational learning.`,
            color: '#b78121',
            image: `../../../assets/images/thematic-areas/dashboard-next-generation.png`,
            displayShowMore: false,
        },
        {
            title: 'Living Economy',
            descriptions: `Support the development of sustainable and climate-resilient livelihoods and other resource management activities of rural communities that ensures food security and sovereignty; Support for the development of social enterprises owned and managed by IPLCs.`,
            color: '#c55d1e',
            image: `../../../assets/images/thematic-areas/dashboard-living-economy.jpeg`,
            displayShowMore: false,
        },
        {
            title: 'Gender Equality, Disability (Rights) and Social Inclusion (GEDSI)',
            descriptions: `Cross cutting theme across Samdhana's work, to elevate and increase recognition of the role of women in indigenous communities, highlighting the vital contributions they make to sustainable livelihoods, culture, and community education. We support local women in taking on leadership roles while also expanding social inclusion to involve differently abled people, youth groups, and the elderly.`,
            color: '#d29427',
            image: `../../../assets/images/thematic-areas/dashboard-gedsi.JPG`,
            displayShowMore: false,
        },
        {
            title: 'Mitigating & Adapting to Climate Change',
            descriptions: `Helping secure land rights for IPLCs esp in landscapes earmarked for low carbon emissions. This involves outreach activities to communicate and clarify rights holders’ understanding of climate change and their roles as guardians of the landscape. Through carbon sequestration initiatives, rights mapping, green development planning, and community REDD+ projects, IPLCs are supported to lead in climate mitigation. Supporting the revival and promotion of indigenous knowledge and local practices as an untapped resource to mitigate and adapt to climate change; and supporting spaces for better understanding of IPLCs capacities for resilience building, in the face of loss and damage.`,
            color: '#d46623',
            image: `../../../assets/images/thematic-areas/dashboard-mitigating-to-climate-change.jpg`,
            displayShowMore: false,
        },
    ];

    availableShowMoreItems: Record<string, string | boolean>[] = [];

    ngOnInit() {
        this.areas = this.areas.map((item) => {
            if (item.descriptions.length > 200) {
                item.displayShowMore = true;

                this.availableShowMoreItems.push({
                    title: item.title,
                    isShowingMore: true,
                });
            }
            return item;
        });
    }

    getShowMoreFlag(title: string) {
        const item = this.availableShowMoreItems.find((item) => item['title'] === title);
        return item?.['isShowingMore'] || false;
    }

    handleOnToggleShowMore(title: string) {
        this.availableShowMoreItems = this.availableShowMoreItems.map((item) => {
            if (item['title'] === title) {
                item['isShowingMore'] = !item['isShowingMore'];
            }
            return item;
        });
    }
}
