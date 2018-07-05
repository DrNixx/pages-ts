import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";
import forEach from 'lodash-es/forEach';

const stringQuickview = 'Quickview';

export interface IQuickviewOptions extends IControlOptions {
    notes?: string,
    alerts?: string,
    chat?: string,
    notesList?: string,
    noteEditor?: string,
    deleteNoteButton?: string,
    deleteNoteConfirmButton?: string,
    newNoteButton?: string,
    backButton?: string,
}

export class Quickview extends Control<IQuickviewOptions> {
    bezierEasing: number[];

    public static defaultProps: IQuickviewOptions = {
        notes: '#note-views',
        alerts: '#alerts',
        chat: '#chat',
        notesList: '.list',
        noteEditor: '.quick-note-editor',
        deleteNoteButton: '.delete-note-link',
        deleteNoteConfirmButton: '.btn-remove-notes',
        newNoteButton: '.new-note-link',
        backButton: '.close-note-link'
    };

    constructor(element: HTMLElement | string, options: IQuickviewOptions) {
        super(element, options);

        this.bezierEasing = [.05, .74, .27, .99];

        this.bind();
    }

    private bind = () => {
        const self = this;
        if ( !(stringQuickview in self.element ) ) { // prevent adding event handlers twice
            pg.live('.list > ul > li', 'click', function(e) {
                const note = this.querySelector('.note-preview');
                pg.queryElement(self.options.noteEditor).innerHTML = note.innerHTML;
                pg.toggleClass(pg.queryElement(self.options.notes), 'push');
            }, pg.queryElement(this.options.notes));
        
            pg.live('.list > ul > li .checkbox', 'click', function(e) {
                e.stopPropagation();
            }, pg.queryElement(this.options.notes));
        
            pg.live(self.options.backButton, 'click', function(e) {
                const link = <HTMLAnchorElement>pg.queryElement(self.options.notes).querySelector('.toolbar > li > a');
                pg.removeClass(link, 'active');
                pg.toggleClass(pg.queryElement(self.options.notes), 'push')
            }, pg.queryElement(this.options.notes));
           
        
            pg.live(this.options.deleteNoteButton, 'click', function(e) {
                e.preventDefault();
                pg.toggleClass(this,'selected');
                const checkboxes = <NodeListOf<HTMLInputElement>>pg.queryElement(self.options.notes).querySelectorAll('.list > ul > li .checkbox');
                if (!checkboxes.length) {
                    return;
                }
                
                var fadeClass = checkboxes[0].style.display === 'none' ? "fadeIn" : "fadeOut";
        
                forEach(checkboxes, function(checkbox) {
                    Velocity.animate(checkbox, fadeClass, { 
                        duration: 200,
                        complete:function(){                  
                        } 
                    });
                });
        
                var deleteConfirm = pg.queryElement(self.options.deleteNoteConfirmButton)
                    Velocity.animate(deleteConfirm, fadeClass, { 
                        duration: 200,
                        complete:function(){   
                            pg.removeClass(deleteConfirm, 'hide')               
                        } 
                    });
                
            });
        
            pg.live(this.options.newNoteButton, 'click', function(e) {
                e.preventDefault();
                pg.queryElement(self.options.noteEditor).innerHTML = ''
            });
        
            pg.live(this.options.deleteNoteConfirmButton, 'click', function(e) {
                var checked = <NodeListOf<HTMLInputElement>>pg.queryElement(self.options.notes).querySelectorAll('input[type=checkbox]:checked')
                for (var i = 0; i < checked.length; i++) {
                    const el = pg.getClosest(checked[i], 'li');
                    if (el) {
                        el.remove();
                    }
                }
            });
        
            pg.live('.toolbar > li > a', 'click', function(e) {
                //e.preventDefault();
                var command = this.getAttribute('data-action');
                document.execCommand(command, false, null);
                pg.toggleClass(this, 'active');
            }, pg.queryElement(this.options.notes));
        
            var toggleEvent = function(this: HTMLElement, e: Event) {
                var elem = this.getAttribute('data-toggle-element');
                pg.toggleClass(pg.queryElement(elem),'open');
                e.preventDefault();
            }
            var toggles = document.querySelectorAll('[data-toggle="quickview"]');
            forEach(toggles, function(toggle) {
                pg.on(toggle, 'click', toggleEvent)
                pg.on(toggle, 'touchstart', toggleEvent)
            });            

            self.element[stringQuickview] = self;
        }
    }
}

pg[stringQuickview] = Quickview;