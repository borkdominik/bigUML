package com.eclipsesource.uml.modelserver.commands.usecasediagram.actor;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.internal.impl.ModelImpl;

public class RemoveActorCommand extends UmlSemanticElementCommand {

    protected final String semanticUriFragment;

    public RemoveActorCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        Actor actorToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Actor.class);
        EObject container = actorToRemove.eContainer();
        if (container == null || container instanceof ModelImpl) {
            umlModel.getPackagedElements().remove(actorToRemove);
        } else if (container instanceof Package) {
            ((Package) container).getPackagedElements().remove(actorToRemove);
        }
    }
}
