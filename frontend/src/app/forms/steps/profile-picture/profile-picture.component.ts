import { Component, Input } from '@angular/core';
import {
  CameraDirection,
  CameraOptions,
  CameraResultType,
  CameraSource,
  Plugins,
} from '@capacitor/core';

import { FormGroup } from '../../../common/forms/forms';
import { FormsData } from '../../../model/forms-data.model';

@Component({
  selector: 'form-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
})
export class ProfilePictureComponent {
  constructor() {}
  @Input()
  formsData: FormGroup<FormsData>;

  takePicture(): void {
    const cameraConfig: CameraOptions = {
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      direction: CameraDirection.Front,
    };
    Plugins.Camera.getPhoto(cameraConfig)
      .then((result) => {
        this.formsData.controls.profilePicture.controls.pictureBase64.setValue(
          'data:image/jpeg;base64,' + result.base64String
        );
      })
      .catch(() => {
        // It looks like closing the Camera overlay in the webview, rejects the promise
      });
  }
  /**
   * delete picture entry and reset page so you can add a new picture.
   */
  deletePictureEntry(): void {
    this.formsData.controls.profilePicture.controls.pictureBase64.setValue('');
  }
}
