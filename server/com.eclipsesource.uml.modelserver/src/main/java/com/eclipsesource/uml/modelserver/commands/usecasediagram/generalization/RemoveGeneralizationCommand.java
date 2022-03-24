package com.eclipsesource.uml.modelserver.commands.usecasediagram.generalization;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Generalization;
import org.eclipse.uml2.uml.UseCase;

public class RemoveGeneralizationCommand extends UmlSemanticElementCommand {

    protected final String semanticUriFragment;

    public RemoveGeneralizationCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        Generalization generalizationToRemove = UmlSemanticCommandUtil
                .getElement(umlModel, semanticUriFragment, Generalization.class);
        if (generalizationToRemove == null) {
            return;
        }
        EObject container = generalizationToRemove.eContainer();
        if (container instanceof UseCase) {
            ((UseCase) container).getGeneralizations().remove(generalizationToRemove);
        } else if (container instanceof Actor) {
            ((Actor) container).getGeneralizations().remove(generalizationToRemove);
        }
    }

}
