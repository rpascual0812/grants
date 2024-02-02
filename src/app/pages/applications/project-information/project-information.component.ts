import { Component } from '@angular/core';
import { COUNTRIES_MOCK } from '../mocks/countries.mock';

interface ProjectLocation {
  id: number;
  country: string;
  province: string;
}

@Component({
  selector: 'app-project-information',
  templateUrl: './project-information.component.html',
  styleUrls: ['./project-information.component.scss'],
})
export class ProjectInformationComponent {
  durationOpts: string[] = [];
  projectLoc: ProjectLocation[] = [];
  countriesOpt = COUNTRIES_MOCK;

  ngOnInit() {
    this.getDurationOpts();
  }

  getDurationOpts() {
    for (let i = 1; i <= 36; i++) {
      this.durationOpts.push(`${i} Months`);
    }
  }

  onAddProjectLoc() {
    this.projectLoc = [
      ...this.projectLoc,
      {
        id: new Date().getTime(),
        country: '',
        province: '',
      },
    ];
  }

  onRemoveProjectLoc(id: number) {
    this.projectLoc = this.projectLoc.filter((proj) => proj.id !== id);
  }
}
