<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

![a45081_frontend](https://socialify.git.ci/iamkhanhh/a45081_frontend/image?custom_description=A+Web-Based+Bioinformatics+Tool+for+Genetic+Variant+Annotation+Supporting+Clinical+Applications&description=1&forks=1&issues=1&language=1&name=1&owner=1&pattern=Solid&pulls=1&stargazers=1&theme=Dark)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/iamkhanhh/a45081_frontend">
    <img src="https://genetics-s3-prod.s3.ap-southeast-1.amazonaws.com/public/genetics.png" alt="Logo">
  </a>
  
<h3 align="center">Genetics</h3>

  <p align="center">
    A Web-Based Bioinformatics Tool for Genetic Variant Annotation Supporting Clinical Applications
    <br />
    <a href="https://github.com/iamkhanhh/a45081_frontend"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/iamkhanhh/a45081_frontend">View Demo</a>
    &middot;
    <a href="https://github.com/iamkhanhh/a45081_frontend/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/iamkhanhh/a45081_frontend/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#tech-stack">Tech Stack</a></li>
      </ul>
      <ul>
        <li><a href="#features">Features</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
[![Product Name Screen Shot][product-screenshot]](https://example.com)

A web-based genomics annotation platform that allows researchers, labs, and universities to securely upload FASTQ and VCF files, run Ensembl VEP for variant annotation, and generate interactive biological reports. Built with AWS S3 storage and scalable compute, the platform provides automated pipelines, customizable annotation presets, and comprehensive reports to support genetic research, education, and clinical discovery.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Tech Stack

* [![Angular][Angular.io]][Angular-url]
* [![NestJS][NestJS.com]][NestJS-url]
* [![MySQL][MySQL.com]][MySQL-url]
* [![MongoDB][MongoDB.com]][MongoDB-url]
* [![Docker][Docker.com]][Docker-url]
* [![AWS S3][AWS-S3.com]][AWS-S3-url]
* [![EC2][AWS-EC2.com]][AWS-EC2-url]
* [![VEP][VEP.com]][VEP-url]
* [![BCFtools][BCFtools.com]][BCFtools-url]
* [![JWT][JWT.io]][JWT-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Features
* Secure uploads to S3: Client‑side direct uploads via pre‑signed URLs, checksum verification, and resumable transfers (Tus/Multipart).
* File types: FASTQ (R1/R2 paired), VCF.
* Automated pipeline:
    - FASTQ → (optional) alignment & variant calling (BWA‑MEM2 + GATK or DRAGEN* pluggable) → VCF.
    - VCF → VEP annotation with configurable plugins, cache builds, and custom resources.
* Annotation presets: WES/WGS; cache build selection (e.g., GRCh37, GRCh38).
* Report generation: Per‑sample and cohort reports (PDF): pathogenicity, gene summaries, and top variants of interest.
* Queryable variant warehouse: Filter by gene, transcript, consequence, clinvar, gnomAD AF, impact, zygosity, inheritance, and custom tags.
* Notifications: Email when sign up start, succeed, or fail.
* Scalable workers: Queue‑based job orchestration with autoscaling compute (AWS Fargate/ECS or EC2 ASG); spot‑friendly.
* Security & compliance: S3 SSE‑KMS, signed URLs, least‑privilege IAM, IP allowlists, audit logs, and optional PHI/PII redaction.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Make sure you meet the requirements and complete each step below.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@20.11.1 -g
  ```
* bcf-tools, vcf-tools and bed-tools
  ```sh
  sudo apt update && sudo apt install -y bcftools vcftools bedtools
  ```
* VEP (please go to the VEP official website)
  ```sh
  git clone https://github.com/Ensembl/ensembl-vep
  ```
* db-migrate
  ```sh
  npm install -g db-migrate
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/iamkhanhh/a45081_frontend.git
   ```
2. Go to the repo folder
   ```sh
   cd a45081_frontend
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Run project
   ```sh
   ./node_modules/.bin/ng serve
   ```
5. Navigate to `http://localhost:4200`. The app will automatically reload if you change any of the source files.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [ ] Sign In/Sign Up
- [ ] Change personal information and password
- [ ] Upload Sample (FastQ/VCF)
- [ ] Create Workspace
- [ ] Create Analysis
    - [ ] Quality Control
    - [ ] List all Variants and filter
    - [ ] Create report with specific variants
    - [ ] Update patient information

See the [open issues](https://github.com/iamkhanhh/a45081_frontend/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/iamkhanhh/a45081_frontend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=iamkhanhh/a45081_frontend" alt="contrib.rocks image" />
</a>

<!-- CONTACT -->
## Contact

Nguyen Quoc Khanh - khanh9102004@gmail.com

Project Link: [https://github.com/iamkhanhh/a45081_frontend](https://github.com/iamkhanhh/a45081_frontend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Ensembl VEP](https://asia.ensembl.org/info/docs/tools/vep/index.html)
* [NestJS](https://docs.nestjs.com/)
* [Angular](https://v17.angular.io/docs)
* [BCF Tools](https://samtools.github.io/bcftools/bcftools.html)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/iamkhanhh/a45081_frontend.svg?style=for-the-badge
[contributors-url]: https://github.com/iamkhanhh/a45081_frontend/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/iamkhanhh/a45081_frontend.svg?style=for-the-badge
[forks-url]: https://github.com/iamkhanhh/a45081_frontend/network/members
[stars-shield]: https://img.shields.io/github/stars/iamkhanhh/a45081_frontend.svg?style=for-the-badge
[stars-url]: https://github.com/iamkhanhh/a45081_frontend/stargazers
[issues-shield]: https://img.shields.io/github/issues/iamkhanhh/a45081_frontend.svg?style=for-the-badge
[issues-url]: https://github.com/iamkhanhh/a45081_frontend/issues
[license-shield]: https://img.shields.io/github/license/iamkhanhh/a45081_frontend.svg?style=for-the-badge
[license-url]: https://github.com/iamkhanhh/a45081_frontend/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: https://genetics-s3-prod.s3.ap-southeast-1.amazonaws.com/public/genetic_screenshot.jpeg
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/

[NestJS.com]: https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white
[NestJS-url]: https://nestjs.com/

[MySQL.com]: https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/

[MongoDB.com]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/

[Docker.com]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/

[AWS-S3.com]: https://img.shields.io/badge/AWS%20S3-569A31?style=for-the-badge&logo=amazon-aws&logoColor=white
[AWS-S3-url]: https://aws.amazon.com/s3/

[AWS-EC2.com]: https://img.shields.io/badge/AWS%20EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white
[AWS-EC2-url]: https://aws.amazon.com/ec2/

[VEP.com]: https://img.shields.io/badge/VEP-000000?style=for-the-badge&logo=databricks&logoColor=white
[VEP-url]: https://www.ensembl.org/info/docs/tools/vep/index.html

[BCFtools.com]: https://img.shields.io/badge/BCFtools-3776AB?style=for-the-badge&logo=gnu-bash&logoColor=white
[BCFtools-url]: http://samtools.github.io/bcftools/

[JWT.io]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white
[JWT-url]: https://jwt.io/

[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com/