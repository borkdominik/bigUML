package com.eclipsesource.uml.modelserver.commands.usecasediagram.component;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;

public class AddComponentCommand extends UmlSemanticElementCommand {

    protected final Component newComponent;
    protected final String parentSemanticUriFragment;

    public AddComponentCommand(final EditingDomain domain, final URI modelUri) {
        super(domain, modelUri);
        this.newComponent = UMLFactory.eINSTANCE.createComponent();
        this.parentSemanticUriFragment = null;
    }

    public AddComponentCommand(final EditingDomain domain, final URI modelUri, final String parentUri) {
        super(domain, modelUri);
        this.newComponent = UMLFactory.eINSTANCE.createComponent();
        this.parentSemanticUriFragment = parentUri;
    }

    @Override
    protected void doExecute() {
        newComponent.setName(UmlSemanticCommandUtil.getNewComponentName(umlModel));
        if(parentSemanticUriFragment == null) {
            umlModel.getPackagedElements().add(newComponent);
        } else {
            EObject parent = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);
            if (parent instanceof Package) {
                ((Package) parent).getPackagedElements().add(newComponent);
            }
        }
    }

    public Component getNewComponent() {
        return newComponent;
    }
}
