import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X, Menu, Phone, Clock, Globe, Book, Star, ChevronDown, Users, Briefcase, Heart } from 'lucide-react';

const NYCancerDirectory = () => {
  // Application state
  const [activeTab, setActiveTab] = useState('physicians');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data state
  const [physicians, setPhysicians] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  
  // Filter options derived from data
  const [specialties, setSpecialties] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [languages, setLanguages] = useState([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;
  
  // Mock API fetch (would be replaced with actual API calls)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In production, these would be real API calls
        // const locationsResponse = await fetch('https://api.nycancer.com/open/directory/locations/all');
        // const physiciansResponse = await fetch('https://api.nycancer.com/open/directory/filter/');
        
        // For demo purposes, using sample data
        const mockLocationsData = {
          "filter": "all", 
          "timestamp": "2025-05-02 19:31:01.240991", 
          "data": [
            {
              "info": "", 
              "internal_phone": "718-375-2100", 
              "name": "Accord Urology Brooklyn", 
              "img": "https://nycancer.com/media/location_pic/AccordUrology_63.jpg", 
              "location_types": ["Urology"], 
              "longitude": "-73.955390", 
              "active_providers": [
                {"name": "Elena Orlova", "img": "https://nycancer.com/media/profile_pic/elenaorlova_web.jpg", "slug": "elena_orlova", "link": "https://nycancer.com/bios/elena_orlova", "id": "383d11a2ddf511ed97090a3902a25cdbX8G3G8PT", "speciality": "Nurse Practitioner"},
                {"name": "Lyudmila Emag", "img": "https://nycancer.com/media/profile_pic/lyudmilaemag_web.jpg", "slug": "lyudmila_emag", "link": "https://nycancer.com/bios/lyudmila_emag", "id": "56f62d50984411ed97090a3902a25cdbYG5JWU8Q", "speciality": "Nurse Practitioner"},
                {"name": "Dr. Vitaly Raykhman", "img": "https://nycancer.com/media/profile_pic/vitalyraykhman_web.jpg", "slug": "dr_vitaly_raykhman", "link": "https://nycancer.com/bios/dr_vitaly_raykhman", "id": "f102b826984111ed97090a3902a25cdbZLN2F47Z", "speciality": "Urologist"},
                {"name": "Dr. Yuly Chalik", "img": "https://nycancer.com/media/profile_pic/yulychalik_web.jpg", "slug": "dr_yuly_chalik", "link": "https://nycancer.com/bios/dr_yuly_chalik", "id": "e24da27c984211ed97090a3902a25cdbER89LION", "speciality": "Urologist"}
              ], 
              "google_profile_link": "https://www.google.com/search?q=718-375-2100+&rlz=1C1GCEA_en&ei=QP7SY6ytAZ-f5NoPvsWnmA0&ved=0ahUKEwiszbGApOb8AhWfD1kFHb7iCdMQ4dUDCBA&uact=5&oq=718-375-2100+&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQA0oECEEYAUoECEYYAFDTA1jTA2DCBWgDcAB4AIABT4gBT5IBATGYAQCgAQKgAQHAAQE&sclient=gws-wiz-serp", 
              "link": "https://nycancer.com/locations/accord_urology_brooklyn", 
              "rad_modality": [], 
              "address": "2632 East 14th Street, Brooklyn, NY 11235", 
              "latitude": "40.587030", 
              "services": [], 
              "domains": [{"domain": "nyhealth.com", "display_name": "New York Health", "domain_id": 3}], 
              "slug": "accord_urology_brooklyn"
            },
            {
              "info": "", 
              "internal_phone": "718-375-2100", 
              "name": "Accord Urology Queens", 
              "img": "https://nycancer.com/media/", 
              "location_types": ["Urology"], 
              "longitude": "-73.840020", 
              "active_providers": [
                {"name": "Elena Orlova", "img": "https://nycancer.com/media/profile_pic/elenaorlova_web.jpg", "slug": "elena_orlova", "link": "https://nycancer.com/bios/elena_orlova", "id": "383d11a2ddf511ed97090a3902a25cdbX8G3G8PT", "speciality": "Nurse Practitioner"},
                {"name": "Lyudmila Emag", "img": "https://nycancer.com/media/profile_pic/lyudmilaemag_web.jpg", "slug": "lyudmila_emag", "link": "https://nycancer.com/bios/lyudmila_emag", "id": "56f62d50984411ed97090a3902a25cdbYG5JWU8Q", "speciality": "Nurse Practitioner"},
                {"name": "Dr. Paul Aaronson", "img": "https://nycancer.com/media/profile_pic/PaulAaronso_WEB.jpg", "slug": "dr_paul_aaronson", "link": "https://nycancer.com/bios/dr_paul_aaronson", "id": "425e335e2a6311ee97090a3902a25cdbKSQUHAJM", "speciality": "Urologist"},
                {"name": "Dr. Vitaly Raykhman", "img": "https://nycancer.com/media/profile_pic/vitalyraykhman_web.jpg", "slug": "dr_vitaly_raykhman", "link": "https://nycancer.com/bios/dr_vitaly_raykhman", "id": "f102b826984111ed97090a3902a25cdbZLN2F47Z", "speciality": "Urologist"},
                {"name": "Dr. Yuly Chalik", "img": "https://nycancer.com/media/profile_pic/yulychalik_web.jpg", "slug": "dr_yuly_chalik", "link": "https://nycancer.com/bios/dr_yuly_chalik", "id": "e24da27c984211ed97090a3902a25cdbER89LION", "speciality": "Urologist"}
              ], 
              "google_profile_link": "https://www.google.com/search?q=accord+urology+queens&rlz=1C1GCEA_en&ei=3_7SY9TkEImj5NoPvMmb6As&ved=0ahUKEwiU0KnMpOb8AhWJEVkFHbzkBr0Q4dUDCBA&uact=5&oq=accord+urology+queens&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIOCC4QgAQQxwEQrwEQ6gQyCQgAEBYQHhDxBDoUCC4QsQMQgwEQxwEQ0QMQkQIQ6gQ6EQguELEDEIMBEMcBENEDEJECOgsIABCABBCxAxCDAToICC4QsQMQgwE6EQguEIAEELEDEIMBEMcBENEDOggILhCxAxCABDoOCC4QgAQQsQMQxwEQ0QM6CwgAELEDEIMBEJECOgQIABBDOgUIABCRAjoICAAQsQMQkQI6CAguENQCEJECOggIABCABBCxAzoUCC4QgAQQsQMQgwEQyQMQxwEQ0QM6CwguEIMBELEDEIAEOggIABCxAxCDAToLCC4QgAQQxwEQrwE6EAgAELEDEIMBEJECEEYQ-QE6DggAEIAEELEDEIMBEMkDOhIIABCxAxCDARBDEJECEEYQ-QE6CggAELEDEIMBEEM6CwguEIAEELEDEIMBOgUIABCABDoQCC4QgwEQsQMQgAQQChDqBDoNCC4QgAQQsQMQgwEQCjoNCAAQgAQQsQMQgwEQCjoNCC4QgAQQxwEQrwEQCjoKCAAQgAQQsQMQCjoHCAAQgAQQCjoFCC4QgAQ6CAgAEBYQHhAKOgYIABAWEB46BQgAEIYDSgQIQRgBSgQIRhgAUJjrEFiCghFgsoIRaAdwAHgAgAF6iAHADZIBBDE4LjOYAQCgAQHAAQE&sclient=gws-wiz-serp", 
              "link": "https://nycancer.com/locations/accord_urology_queens", 
              "rad_modality": [], 
              "address": "107-15 Jamaica Avenue, Queens, NY 11418", 
              "latitude": "40.695690", 
              "services": [], 
              "domains": [{"domain": "nyhealth.com", "display_name": "New York Health", "domain_id": 3}], 
              "slug": "accord_urology_queens"
            },
            {
              "info": "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/9iMCqeR-VkI?si=-NcEFRFY7Mcm4SvP\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>", 
              "internal_phone": false, 
              "name": "Astoria Medical Oncology", 
              "img": "https://nycancer.com/media/location_pic/Astoria.jpg", 
              "location_types": ["Medical Oncology"], 
              "longitude": "-73.9230999", 
              "active_providers": [
                {"name": "Dr. Triantafillos Fillos", "img": "https://nycancer.com/media/profile_pic/TriantafillosFillos_WEB.jpg", "slug": "dr_triantafillos_fillos", "link": "https://nycancer.com/bios/dr_triantafillos_fillos", "id": "9cbda590805211eba7e904016b75eb01PBKLAQ05", "speciality": "Medical Oncology & Hematology"},
                {"name": "Dr. San San Wynn", "img": "https://nycancer.com/media/profile_pic/SanSanWynn_WEB.png", "slug": "dr_san_san_wynn", "link": "https://nycancer.com/bios/dr_san_san_wynn", "id": "c5015f78bc8111ef97090a3902a25cdbG92YCHSC", "speciality": "Medical Oncology & Hematology"}
              ], 
              "google_profile_link": false, 
              "link": "https://nycancer.com/locations/astoria_medical_oncology", 
              "rad_modality": [], 
              "address": "30-16 30th Drive, Long Island City, NY 11102", 
              "latitude": "40.7652332", 
              "services": [], 
              "domains": [{"domain": "nycancer.com", "display_name": "New York Cancer & Blood Specialists", "domain_id": 6}], 
              "slug": "astoria_medical_oncology"
            },
            {
              "info": "Our Mission is to provide patients with cancer and blood disorders world-class, patient-centered affordable care in their own communities, close to family and friends.", 
              "internal_phone": false, 
              "name": "Babylon Medical Oncology", 
              "img": "https://nycancer.com/media/location_pic/Babylon.jpg", 
              "location_types": ["Medical Oncology"], 
              "longitude": "-73.3217734", 
              "active_providers": [
                {"name": "Dr. Gurmohan Syali", "img": "https://nycancer.com/media/profile_pic/Gurmohan_Syali.jpg", "slug": "dr_gurmohan_syali", "link": "https://nycancer.com/bios/dr_gurmohan_syali", "id": "051251247dfe11eb958404016b75eb01089E6MXW", "speciality": "Medical Oncology & Hematology"},
                {"name": "Dr. Samir Patel", "img": "https://nycancer.com/media/profile_pic/Samir_Patel.jpg", "slug": "dr_samir_patel", "link": "https://nycancer.com/bios/dr_samir_patel", "id": "f0133d7c803e11eb834104016b75eb013SIR5XJG", "speciality": "Medical Oncology & Hematology"},
                {"name": "Dr. Gerry Rubin", "img": "https://nycancer.com/media/profile_pic/Gerry_Rubin.jpg", "slug": "dr_gerry_rubin", "link": "https://nycancer.com/bios/dr_gerry_rubin", "id": "e5ccd856804211ebbe1604016b75eb01P4OCLG4U", "speciality": "Medical Oncology & Hematology"},
                {"name": "Dr. Sanjeev Jain", "img": "https://nycancer.com/media/profile_pic/dr-jain-732x1024.jpg", "slug": "dr_sanjeev_jain", "link": "https://nycancer.com/bios/dr_sanjeev_jain", "id": "c78c3104805411eba7e904016b75eb01EZUPIN2U", "speciality": "Medical Oncology & Hematology"},
                {"name": "Dr. Isaac Hardoon", "img": "https://nycancer.com/media/profile_pic/IsaacHardoon_WEB.png", "slug": "dr_isaac_hardoon", "link": "https://nycancer.com/bios/dr_isaac_hardoon", "id": "432cb15c55a911eb9c8804016b75eb010QV3AZUJ", "speciality": "Supportive & Palliative Care"},
                {"name": "Dr. Richard Zuniga", "img": "https://nycancer.com/media/profile_pic/Zuniga_75dpi_New.jpg", "slug": "dr_richard_zuniga", "link": "https://nycancer.com/bios/dr_richard_zuniga", "id": "95716332810411eb97ae04016b75eb01VNRA1GSA", "speciality": "Medical Oncology & Hematology"},
                {"name": "Dr. Amishi Desai", "img": "https://nycancer.com/media/profile_pic/Desai_72dpi_.jpg", "slug": "dr_amishi_desai", "link": "https://nycancer.com/bios/dr_amishi_desai", "id": "300cbe10810911eb81ef04016b75eb014SII1DIS", "speciality": "Medical Oncology & Hematology"}
              ], 
              "google_profile_link": false, 
              "link": "https://nycancer.com/locations/babylon_medical_oncology", 
              "rad_modality": [], 
              "address": "72 East Main Street, Babylon, NY 11702", 
              "latitude": "40.6964569",
              "services": ["Medical Oncology", "Infusion", "Lab Services"]
            }
          ]
        };
        
        const mockPhysiciansData = {
          "filter": "all", 
          "timestamp": "2025-05-02 19:31:31.468825", 
          "data": [
            {
              "webpage": "https://nycancer.com/doctors/dr_jeff_vacirca", 
              "focus": [], 
              "video": false, 
              "hospitals": ["John T Mather Memorial Hospital", "Mt. Sinai Medical Center", "St. Catherine Of Siena Medical Center", "The Brooklyn Hospital Center"], 
              "id": "89ca0f7e3e1b11eba72c04016b75eb019XSGJM2O", 
              "internal_phone": false, 
              "img": "https://nycancer.com/media/profile_pic/DrV_WEB.jpg", 
              "languages": "English, Spanish", 
              "department": "medical_oncologists admin", 
              "email": "jvacirca@nycancer.com", 
              "job_title": "Chief Executive Officer", 
              "bio": "<p>Jeffrey Vacirca, MD, FACP, is a renowned cancer physician and visionary leader with extensive experience and commitment to community oncology.</p>\r\n\r\n<p>Dr. Vacirca assumed the role of CEO and Chairman of the Board of New York Cancer & Blood Specialists (NYCBS) in 2008. After two years, the practice emerged as a stronger unified group of physicians dedicated to reinventing themselves as the premier cancer care deliverers of New York.</p>", 
              "npi": "1366446726", 
              "trait": "", 
              "specialty": "Medical Oncology & Hematology", 
              "vcf": "https://nycancer.com/media/vcf/dr_jeff_vacirca.vcf", 
              "phone": "631-751-3000", 
              "link": "https://nycancer.com/bios/dr_jeff_vacirca", 
              "credentials": ["CEO", "FACP", "M.D."], 
              "active_locations": [], 
              "slug": "dr_jeff_vacirca", 
              "name": "Dr. Jeff Vacirca", 
              "bucket": [], 
              "reviews": {
                "google_link": "https://www.google.com/search?q=dr.%20jeffrey%20vacirca&rlz=1C1GCEA_enUS937US939&oq=Dr.+Jeffrey+Vacirca&aqs=chrome.0.0i512j0i22i30l4j69i60l3.1029j0j4&sourceid=chrome&ie=UTF-8&tbs=lf:1,lf_ui:2&tbm=lcl&rflfq=1&num=10&rldimm=12676812321695563523&lqi=ChNkci4gamVmZnJleSB2YWNpcmNhSOvh7r_pgICACFoeEAAQARACGAEYAiISZHIgamVmZnJleSB2YWNpcmNhkgEKb25jb2xvZ2lzdJoBI0NoWkRTVWhOTUc5blMwVkpRMEZuU1VOUGJFbGlSa3AzRUFF&ved=2ahUKEwj43b2fkfH4AhVhlIkEHe4mBq4QvS56BAgKEAE&sa=X&rlst=f#lrd=0x89e83f55692fcd3f:0xafed15a456f57f03,1,,,&rlfi=hd:;si:12676812321695563523,l,ChNkci4gamVmZnJleSB2YWNpcmNhSOvh7r_pgICACFoeEAAQARACGAEYAiISZHIgamVmZnJleSB2YWNpcmNhkgEKb25jb2xvZ2lzdJoBI0NoWkRTVWhOTUc5blMwVkpRMEZuU1VOUGJFbGlSa3AzRUFF;mv:[[40.91365510000001,-73.0192227],[40.8659489,-73.2346073]];tbs:lrf:!1m4!1u2!2m2!2m1!1e1!2m1!1e2!3sIAE,lf:1,lf_ui:2", 
                "zocdoc_profile_link": "https://www.zocdoc.com/doctor/jeffrey-vacirca-md", 
                "vitals_profile_link": "https://www.vitals.com/doctors/Dr_Jeffrey_Vacirca.html", 
                "healthgrades_profile_link": "https://www.healthgrades.com/physician/dr-jeffrey-vacirca-22rkb"
              }, 
              "domains": [{"domain": "nycancer.com", "display_name": "New York Cancer & Blood Specialists", "domain_id": 6}], 
              "divison": [], 
              "cell_phone": "631-525-3095"
            },
            {
              "webpage": "https://nycancer.com/doctors/Dr_Regina_Jablonski", 
              "focus": [], 
              "video": "https://player.vimeo.com/video/268995197", 
              "hospitals": ["John T Mather Memorial Hospital", "St. Catherine Of Siena Medical Center", "St. Charles Hospital"], 
              "id": "93b47b187db911eb95b004016b75eb01D8WUO0YD", 
              "internal_phone": false, 
              "img": "https://nycancer.com/media/profile_pic/Regina_Jablonski.jpg", 
              "languages": "English", 
              "department": "medical_oncologists", 
              "email": "rjablonski@nycancer.com", 
              "job_title": "", 
              "bio": "Dr. Regina Jablonski is a Board Certified physician in Internal Medicine, Hematology and Oncology.\r\n<br><br>\r\nAfter receiving her B.A. in Biology and Chemistry from Bucknell University, Dr. Jablonski went on to get her M.D. from the UMDNJ Robert Wood Johnson Medical School. She did her residency in Internal Medicine at the UMDNJ Robert Wood Johnson University Hospital. Her post-graduate Fellowships in Hematology-Oncology was done at Temple University Hospital and the Fox Chase Cancer Center, Philadelphia, PA.\r\n<br><br>\r\nDr. Jablonski has been involved in several clinical research trials, some of which are being funded by the National Cancer Institute.", 
              "npi": "1760486443", 
              "trait": "", 
              "specialty": "Medical Oncology & Hematology", 
              "vcf": "https://nycancer.com/media/vcf/dr_regina_jablonski.vcf", 
              "phone": "631-675-5378", 
              "link": "https://nycancer.com/bios/dr_regina_jablonski", 
              "credentials": ["FACP", "M.D."], 
              "active_locations": [
                {
                  "info": "To provide patients with cancer and blood disorders world-class, patient-centered affordable care in their own communities, close to family and friends.", 
                  "name": "Port Jefferson Medical Oncology", 
                  "longitude": "-73.031980", 
                  "services": [], 
                  "link": "https://nycancer.com/locations/Port_Jefferson_Medical_Oncology", 
                  "address": "1500 Route 112, Building 1, Port Jefferson Station, NY 11776", 
                  "latitude": "40.914120", 
                  "slug": "port_jefferson_medical_oncology"
                }, 
                {
                  "info": "To provide patients with cancer and blood disorders world-class, patient-centered affordable care in their own communities, close to family and friends.", 
                  "name": "Port Jefferson Station Medical Oncology", 
                  "longitude": "-73.0592023", 
                  "services": ["Medical Oncology"], 
                  "link": "https://nycancer.com/locations/Port_Jefferson_Station_Medical_Oncology", 
                  "address": "49 Route 347, Port Jefferson Station, NY 11776", 
                  "latitude": "40.9140128", 
                  "slug": "port_jefferson_station_medical_oncology"
                }, 
                {
                  "info": "To provide patients with cancer and blood disorders world-class, patient-centered affordable care in their own communities, close to family and friends.", 
                  "name": "Ronkonkoma Medical Oncology", 
                  "longitude": "-73.1071604", 
                  "services": ["Medical Oncology"], 
                  "link": "https://nycancer.com/locations/ronkonkoma_medical_oncology", 
                  "address": "501 Hawkins Avenue, Lake Ronkonkoma, NY 11779", 
                  "latitude": "40.8263035", 
                  "slug": "ronkonkoma_medical_oncology"
                }
              ], 
              "slug": "dr_regina_jablonski", 
              "name": "Dr. Regina Jablonski", 
              "bucket": [], 
              "reviews": {
                "google_link": "https://g.page/r/Cae7ZXIVrfotEAg/review", 
                "zocdoc_profile_link": "https://www.zocdoc.com/doctor/regina-jablonski-md-284863", 
                "vitals_profile_link": "https://www.vitals.com/doctors/Dr_Regina_Jablonski.html", 
                "healthgrades_profile_link": "https://www.healthgrades.com/physician/dr-regina-jablonski-2lsh3"
              }, 
              "domains": [{"domain": "nycancer.com", "display_name": "New York Cancer & Blood Specialists", "domain_id": 6}], 
              "divison": [], 
              "cell_phone": "631-379-6100"
            },
            {
              "webpage": "https://nycancer.com/doctors/Dr_Shahid_Nawaz", 
              "focus": ["Thoratic Tumors", "GI Tumors", "Lymphomas"], 
              "video": "https://player.vimeo.com/video/268995908", 
              "hospitals": ["Eastern Long Island Hospital", "John T Mather Memorial Hospital", "Long Island Community Hospital", "Peconic Bay Medical Center", "St. Catherine Of Siena Medical Center", "St. Charles Hospital", "University Hospital at Stony Brook"], 
              "id": "fb7b07007dfd11eb958404016b75eb0139DGA5RN", 
              "internal_phone": false, 
              "img": "https://nycancer.com/media/profile_pic/Shahid_Nawaz.jpg", 
              "languages": "English, Hindi, Pashto, Urdu", 
              "department": "medical_oncologists", 
              "email": "snawaz@nycancer.com", 
              "job_title": "", 
              "bio": "Dr. Nawaz is a medical hematologist and oncologist. Dr. Nawaz is an attending physician with New York Cancer Specialists since 2004. He received his Doctor of Medicine degree from Khyber Medical College, Peshawar Pakistan.", 
              "npi": "1306847892", 
              "trait": "", 
              "specialty": "Medical Oncology & Hematology", 
              "vcf": "https://nycancer.com/media/vcf/dr_shahid_nawaz.vcf", 
              "phone": "631-675-5378", 
              "link": "https://nycancer.com/bios/dr_shahid_nawaz", 
              "credentials": ["M.D."], 
              "active_locations": [
                {
                  "info": "World-class cancer care, close to home", 
                  "name": "Port Jefferson Medical Oncology", 
                  "longitude": "-73.031980", 
                  "services": ["Medical Oncology", "Hematology"], 
                  "link": "https://nycancer.com/locations/Port_Jefferson_Medical_Oncology", 
                  "address": "1500 Route 112, Building 1, Port Jefferson Station, NY 11776", 
                  "latitude": "40.914120", 
                  "slug": "port_jefferson_medical_oncology"
                }
              ], 
              "slug": "dr_shahid_nawaz", 
              "name": "Dr. Shahid Nawaz", 
              "bucket": [], 
              "reviews": {
                "google_link": "https://g.page/r/Cae7ZXIVrfotEAg/review", 
                "zocdoc_profile_link": "https://www.zocdoc.com/doctor/shahid-nawaz-md", 
                "vitals_profile_link": "https://www.vitals.com/doctors/Dr_Shahid_Nawaz.html", 
                "healthgrades_profile_link": "https://www.healthgrades.com/physician/dr-shahid-nawaz-2lsh3"
              }, 
              "domains": [{"domain": "nycancer.com", "display_name": "New York Cancer & Blood Specialists", "domain_id": 6}], 
              "divison": [], 
              "cell_phone": "631-379-6122"
            }
          ]
        };
        
        // Process locations data
        setLocations(mockLocationsData.data);
        
        // Process physicians data
        setPhysicians(mockPhysiciansData.data);
        
        // Extract filter options
        // Specialties
        const allSpecialties = new Set();
        mockPhysiciansData.data.forEach(physician => {
          if (physician.specialty) {
            allSpecialties.add(physician.specialty);
          }
        });
        
        mockLocationsData.data.forEach(location => {
          if (location.location_types && location.location_types.length > 0) {
            location.location_types.forEach(type => allSpecialties.add(type));
          }
        });
        
        setSpecialties(Array.from(allSpecialties));
        
        // Location options (cities/boroughs)
        const allLocationOptions = new Set();
        mockLocationsData.data.forEach(location => {
          if (location.address) {
            const addressParts = location.address.split(',');
            if (addressParts.length >= 2) {
              const cityState = addressParts[1].trim();
              const cityParts = cityState.split(' ');
              if (cityParts.length >= 1) {
                allLocationOptions.add(cityParts[0]);
              }
            }
          }
        });
        
        setLocationOptions(Array.from(allLocationOptions));
        
        // Languages
        const allLanguages = new Set();
        mockPhysiciansData.data.forEach(physician => {
          if (physician.languages) {
            physician.languages.split(',').forEach(lang => 
              allLanguages.add(lang.trim())
            );
          }
        });
        
        setLanguages(Array.from(allLanguages));
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching directory data:", err);
        setError("Unable to load directory data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Toggle filter selection
  const toggleFilter = (type, value) => {
    switch(type) {
      case 'specialty':
        setSelectedSpecialties(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'location':
        setSelectedLocations(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'language':
        setSelectedLanguages(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      default:
        break;
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialties([]);
    setSelectedLocations([]);
    setSelectedLanguages([]);
  };
  
  // Filter results based on current criteria
  const getFilteredResults = () => {
    if (activeTab === 'physicians') {
      return physicians.filter(physician => {
        // Search query matching
        const matchesSearch = !searchQuery || 
          physician.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (physician.specialty && physician.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Specialty filter
        const matchesSpecialties = selectedSpecialties.length === 0 || 
          (physician.specialty && selectedSpecialties.includes(physician.specialty));
        
        // Location filter (check if physician practices at any of the selected locations)
        const matchesLocations = selectedLocations.length === 0 ||
          (physician.active_locations && physician.active_locations.some(loc => {
            if (loc.address) {
              const addressParts = loc.address.split(',');
              if (addressParts.length >= 2) {
                const cityState = addressParts[1].trim();
                const cityParts = cityState.split(' ');
                if (cityParts.length >= 1) {
                  return selectedLocations.includes(cityParts[0]);
                }
              }
            }
            return false;
          }));
        
        // Language filter
        const matchesLanguages = selectedLanguages.length === 0 ||
          (physician.languages && 
            selectedLanguages.some(lang => 
              physician.languages.toLowerCase().includes(lang.toLowerCase())
            ));
        
        return matchesSearch && matchesSpecialties && matchesLocations && matchesLanguages;
      });
    } else {
      // Filter locations
      return locations.filter(location => {
        // Search query matching
        const matchesSearch = !searchQuery || 
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (location.address && location.address.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Specialty/service filter
        const matchesSpecialties = selectedSpecialties.length === 0 || 
          (location.location_types && location.location_types.some(type => 
            selectedSpecialties.includes(type)
          ));
        
        // Location city/borough filter
        const matchesLocations = selectedLocations.length === 0 ||
          (location.address && (() => {
            const addressParts = location.address.split(',');
            if (addressParts.length >= 2) {
              const cityState = addressParts[1].trim();
              const cityParts = cityState.split(' ');
              if (cityParts.length >= 1) {
                return selectedLocations.includes(cityParts[0]);
              }
            }
            return false;
          })());
        
        return matchesSearch && matchesSpecialties && matchesLocations;
      });
    }
  };
  
  const filteredResults = getFilteredResults();
  
  // Pagination
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );
  
  // Extract city and state from address
  const extractCityState = (address) => {
    if (!address) return { city: '', state: '' };
    
    const parts = address.split(',');
    if (parts.length < 2) return { city: '', state: '' };
    
    const cityStatePart = parts[1].trim();
    const cityStateParts = cityStatePart.split(' ');
    
    if (cityStateParts.length < 2) return { city: cityStatePart, state: '' };
    
    const state = cityStateParts[cityStateParts.length - 1];
    const city = cityStatePart.substring(0, cityStatePart.length - state.length - 1).trim();
    
    return { city, state };
  };
  
  // Get borough name from address
  const getBoroughFromAddress = (address) => {
    if (!address) return '';
    
    const { city } = extractCityState(address);
    
    const boroughs = {
      'Brooklyn': 'Brooklyn',
      'Queens': 'Queens',
      'Bronx': 'Bronx',
      'Staten Island': 'Staten Island', 
      'New York': 'Manhattan',
      'Manhattan': 'Manhattan'
    };
    
    return boroughs[city] || city;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading directory...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-3xl mx-auto">
        <div className="text-red-600 mb-2 text-xl">⚠️ {error}</div>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">NYCancer Directory</h1>
        <p className="text-gray-600">Find healthcare providers and locations in your community</p>
      </header>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-lg ${activeTab === 'physicians' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('physicians')}
        >
          Find a Physician
        </button>
        <button
          className={`px-4 py-2 font-medium text-lg ${activeTab === 'locations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('locations')}
        >
          Our Locations
        </button>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder={activeTab === 'physicians' ? "Search by physician name or specialty..." : "Search by location name or address..."}
            className="w-full px-4 py-2 pl-10 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>
        
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filtersOpen ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter size={18} />
            Filters
            {(selectedSpecialties.length + selectedLocations.length + selectedLanguages.length) > 0 && (
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {selectedSpecialties.length + selectedLocations.length + selectedLanguages.length}
              </span>
            )}
          </button>
          
          {activeTab === 'locations' && (
            <div className="flex rounded-lg overflow-hidden border">
              <button 
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                onClick={() => setViewMode('list')}
              >
                <Menu size={18} />
              </button>
              <button 
                className={`px-3 py-2 ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                onClick={() => setViewMode('map')}
              >
                <MapPin size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Filters Panel */}
      {filtersOpen && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filter Results</h3>
            {(selectedSpecialties.length + selectedLocations.length + selectedLanguages.length) > 0 && (
              <button 
                className="text-blue-600 text-sm flex items-center gap-1"
                onClick={clearFilters}
              >
                <X size={16} /> Clear all filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Specialties Filter */}
            <div>
              <h4 className="font-medium mb-2">Specialties</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {specialties.map(specialty => (
                  <label key={specialty} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSpecialties.includes(specialty)}
                      onChange={() => toggleFilter('specialty', specialty)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Locations Filter */}
            <div>
              <h4 className="font-medium mb-2">Locations</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {locationOptions.map(location => (
                  <label key={location} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => toggleFilter('location', location)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">{location}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Languages Filter - only for physicians */}
            {activeTab === 'physicians' && (
              <div>
                <h4 className="font-medium mb-2">Languages</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {languages.map(language => (
                    <label key={language} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(language)}
                        onChange={() => toggleFilter('language', language)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{language}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        {filteredResults.length} {activeTab === 'physicians' ? 'physicians' : 'locations'} found
      </div>
      
      {/* No Results Message */}
      {filteredResults.length === 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
          <p className="text-blue-800 font-medium">No {activeTab === 'physicians' ? 'physicians' : 'locations'} found matching your criteria.</p>
          <p className="text-blue-600 mt-2">Try adjusting your filters or search term.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Clear All Filters
          </button>
        </div>
      )}
      
      {/* Results Display */}
      {activeTab === 'physicians' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedResults.map(physician => (
            <div key={physician.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="p-4">
                <div className="flex gap-4">
                  <img 
                    src={physician.img || '/api/placeholder/120/120'} 
                    alt={physician.name} 
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/api/placeholder/120/120';
                    }}
                  />
                  <div>
                    <h3 className="font-bold text-blue-800">{physician.name}</h3>
                    <p className="text-gray-600">{physician.specialty}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {physician.credentials && physician.credentials.map((credential, index) => (
                        <span key={index} className="text-xs text-gray-500">
                          {credential}{index < physician.credentials.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {physician.job_title && (
                  <div className="mt-3 flex items-center gap-2">
                    <Briefcase size={16} className="text-gray-500" />
                    <span className="text-gray-700">{physician.job_title}</span>
                  </div>
                )}
                
                {/* Locations */}
                {physician.active_locations && physician.active_locations.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                      <div className="text-sm text-gray-700">
                        {physician.active_locations.slice(0, 2).map((location, index) => (
                          <div key={index} className="mb-1">
                            {location.name}
                          </div>
                        ))}
                        {physician.active_locations.length > 2 && (
                          <span className="text-blue-600 text-xs">
                            +{physician.active_locations.length - 2} more locations
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Languages */}
                {physician.languages && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Languages:</span>
                    </div>
                    <div className="ml-6 flex flex-wrap gap-1">
                      {physician.languages.split(',').map((language, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                          {language.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Hospitals - if available */}
                {physician.hospitals && physician.hospitals.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <line x1="9" x2="15" y1="9" y2="9" />
                        <line x1="12" x2="12" y1="5" y2="19" />
                      </svg>
                      <span className="text-sm text-gray-600">Hospital Affiliations:</span>
                    </div>
                    <div className="ml-6 mt-1">
                      <span className="text-xs text-gray-700">
                        {physician.hospitals.slice(0, 2).join(', ')}
                        {physician.hospitals.length > 2 && (
                          <span className="text-blue-600"> +{physician.hospitals.length - 2} more</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Focus Areas - if available */}
                {physician.focus && physician.focus.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <Heart size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Focus Areas:</span>
                    </div>
                    <div className="ml-6 flex flex-wrap gap-1 mt-1">
                      {physician.focus.map((focus, index) => (
                        <span key={index} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex gap-2">
                  <a 
                    href={physician.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700 transition-colors"
                  >
                    View Profile
                  </a>
                  {physician.phone && (
                    <a 
                      href={`tel:${physician.phone}`}
                      className="bg-white border border-blue-600 text-blue-600 py-2 px-4 rounded flex items-center justify-center hover:bg-blue-50"
                    >
                      <Phone size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedResults.map(location => (
              <div key={location.slug} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                <img 
                  src={location.img || '/api/placeholder/400/200'} 
                  alt={location.name} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/api/placeholder/400/200';
                  }}
                />
                <div className="p-4">
                  <h3 className="font-bold text-blue-800 text-xl">{location.name}</h3>
                  
                  <div className="mt-3 space-y-2">
                    {/* Address */}
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                      <div className="text-gray-700">{location.address}</div>
                    </div>
                    
                    {/* Phone */}
                    {location.internal_phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-500" />
                        <div className="text-gray-700">{location.internal_phone}</div>
                      </div>
                    )}
                    
                    {/* Location Types / Specialties */}
                    {location.location_types && location.location_types.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-700 mb-1">Specialties:</h4>
                        <div className="flex flex-wrap gap-1">
                          {location.location_types.map((type, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Services */}
                    {location.services && location.services.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-700 mb-1">Services:</h4>
                        <div className="flex flex-wrap gap-1">
                          {location.services.map((service, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Providers at this location */}
                  {location.active_providers && location.active_providers.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Users size={16} />
                        Providers at this location:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {location.active_providers.slice(0, 4).map((provider, index) => (
                          <a 
                            href={provider.link} 
                            target="_blank"
                            rel="noopener noreferrer"
                            key={index}
                            className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
                          >
                            <img 
                              src={provider.img || '/api/placeholder/40/40'} 
                              alt={provider.name} 
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/api/placeholder/40/40';
                              }}
                            />
                            <div className="overflow-hidden">
                              <div className="text-sm font-medium text-blue-800 truncate">{provider.name}</div>
                              <div className="text-xs text-gray-600 truncate">{provider.speciality}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                      {location.active_providers.length > 4 && (
                        <div className="mt-2 text-center">
                          <a href={location.link} className="text-sm text-blue-600 hover:underline">
                            See all {location.active_providers.length} providers
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 flex gap-2">
                    <a 
                      href={location.link} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700 transition-colors"
                    >
                      View Location
                    </a>
                    <a 
                      href={`https://maps.google.com/?q=${location.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-blue-600 text-blue-600 py-2 px-4 rounded flex items-center justify-center hover:bg-blue-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 17 4 12 9 7" />
                        <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-4 h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Interactive map would display here</p>
              <p className="text-sm text-gray-500">Showing {filteredResults.length} locations</p>
            </div>
          </div>
        )
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex border rounded overflow-hidden">
            <button 
              className={`px-4 py-2 border-r ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button 
                  key={i}
                  className={`px-4 py-2 ${pageNum === currentPage ? 'bg-blue-600 text-white' : 'border-x hover:bg-gray-100'}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className={`px-4 py-2 border-l ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Info cards with related resources */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-800 text-lg mb-2">Need assistance?</h3>
          <p className="text-gray-700 mb-4">Our patient navigators can help you find the right physician for your needs.</p>
          <div className="flex items-center gap-3 text-blue-800">
            <Phone size={20} />
            <span className="font-medium">Call (800) 555-1234</span>
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <h3 className="font-bold text-green-800 text-lg mb-2">New patient?</h3>
          <p className="text-gray-700 mb-4">Access our comprehensive resources to prepare for your first visit.</p>
          <a href="#" className="inline-flex items-center gap-2 text-green-800 font-medium">
            <Book size={20} />
            <span>Patient Resources</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NYCancerDirectory;