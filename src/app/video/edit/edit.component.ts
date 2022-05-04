import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import IClip from 'src/app/models/clip.modal';
import { ModalService } from 'src/app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {

  @Input() activeClip: IClip | null = null
  inSubmission = false
  showAlert = false
  alertMsg = "Please wait! Updating clip."
  alertColor = "blue"
  @Output() update = new EventEmitter();

  clipID = new FormControl('')

  title = new FormControl('', [Validators.required, Validators.minLength(3)])

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  })

  constructor(private modal: ModalService, private clipService: ClipService) { }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip')
  }

  ngOnChanges() {
    if(!this.activeClip) {
      return
    }

    this.inSubmission = false
    this.showAlert = false
    this.clipID.setValue(this.activeClip.docID)
    this.title.setValue(this.activeClip.title)
  }

  async updateClipData() {
    if(!this.activeClip){
      return
    }

    this.inSubmission = true
    this.showAlert = true
    this.alertMsg = "Please wait! Updating clip."
    this.alertColor = "blue"

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value)     
    } 
    catch (e) {
      this.alertColor = 'red'
      this.alertMsg = 'Update failed! Please try again later'
      this.inSubmission = false

      return
    }

    this.activeClip.title = this.title.value
    this.update.emit(this.activeClip)

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMsg = 'Success! Your clip is updated.'
  }
}
