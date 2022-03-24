package com.eclipsesource.uml.modelserver.commands.usecasediagram.actor;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;


public class AddActorCommand extends UmlSemanticElementCommand {

    protected final Actor newActor;
    protected final String parentSemanticUriFragment;

    public AddActorCommand(final EditingDomain domain, final URI modelUri) {
        super(domain, modelUri);
        this.newActor = UMLFactory.eINSTANCE.createActor();
        this.parentSemanticUriFragment = null;
    }

    public AddActorCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUri) {
        super(domain, modelUri);
        this.newActor = UMLFactory.eINSTANCE.createActor();
        this.parentSemanticUriFragment = parentSemanticUri;
    }

    @Override
    protected void doExecute() {
        newActor.setName(UmlSemanticCommandUtil.getNewActorName(umlModel));
        if (parentSemanticUriFragment == null) {
            umlModel.getPackagedElements().add(newActor);
        } else {
            Package parentPackage = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Package.class);
            parentPackage.getPackagedElements().add(newActor);
        }
    }

    public Actor getNewActor() {
        return newActor;
    }
}
