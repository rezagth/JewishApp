import { Prayer, ServiceType, Nusach } from '../types';
import siddurSfaradHe from '../data/siddur_sfarad_he.json';

// Types pour le JSON
interface JsonSection {
  label: string;
  ref: string | null;
  text_he: string;
}

interface JsonService {
  label: string;
  sections: Record<string, JsonSection>;
}

interface SiddurJson {
  siddur: Record<string, JsonService>;
}

const typedSiddur = siddurSfaradHe as SiddurJson;

export class SiddurService {
  static async getCompleteSiddur(
    serviceType: ServiceType,
    nusach: Nusach
  ): Promise<Prayer[]> {
    // Normalisation du type de service pour correspondre aux clés JSON
    let jsonKey = serviceType.toLowerCase();
    if (jsonKey === "ma'ariv") jsonKey = "maariv";
    if (jsonKey === "arvit") jsonKey = "maariv";

    const serviceData = typedSiddur.siddur[jsonKey];
    
    if (!serviceData) {
      console.warn(`Service ${jsonKey} non trouvé dans le JSON`);
      return [];
    }

    return Object.entries(serviceData.sections).map(([id, section], index) => ({
      id: `${jsonKey}:${id}`,
      title: section.label, // Titre en hébreu depuis le JSON (sera utilisé comme titre principal)
      titleHe: section.label,
      content: section.text_he,
      contentHe: section.text_he,
      serviceType,
      nusach,
    }));
  }

  static async getPrayerById(id: string): Promise<Prayer | null> {
    const [serviceKey, sectionId] = id.split(':');
    const serviceData = typedSiddur.siddur[serviceKey];
    
    if (!serviceData || !serviceData.sections[sectionId]) return null;

    const section = serviceData.sections[sectionId];
    return {
      id,
      title: section.label,
      titleHe: section.label,
      content: section.text_he,
      contentHe: section.text_he,
      serviceType: serviceKey as ServiceType,
      nusach: 'sephardic',
    };
  }

  static async getPrayerContent(id: string): Promise<string> {
    const prayer = await this.getPrayerById(id);
    return prayer?.content || '';
  }
}

export default SiddurService;