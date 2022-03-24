package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage;

import com.eclipsesource.uml.modelserver.commands.usecasediagram.actor.RemoveActorCompoundCommand;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase.RemoveUseCaseCompoundCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;
import org.eclipse.uml2.uml.Package;

public class RemovePackageCompoundCommand extends CompoundCommand {

    public RemovePackageCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        Package packageToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Package.class);

        // add later again
        /*for (RemoveCommentEdgeCommand c : UmlCommentEdgeRemoveUtil.removeIncomingCommentEdge(modelUri, domain,
                semanticUriFragment)) {
            this.append(c);
        }*/

        for (PackageableElement elem : packageToRemove.getPackagedElements()) {
            if (elem instanceof Actor) {
                String uri = UmlNotationCommandUtil.getSemanticProxyUri(elem);
                this.append(new RemoveActorCompoundCommand(domain, modelUri, uri));
            } else if (elem instanceof UseCase) {
                String uri = UmlNotationCommandUtil.getSemanticProxyUri(elem);
                this.append(new RemoveUseCaseCompoundCommand(domain, modelUri, uri));
            } /*else if (elem instanceof Component) {
                String uri = UmlNotationCommandUtil.getSemanticProxyUri(elem);
                this.append(new RemoveComponentCompoundCommand(domain, modelUri, uri));
            }*/
        }

        this.append(new RemovePackageCommand(domain, modelUri, semanticUriFragment));
        this.append(new RemovePackageShapeCommand(domain, modelUri, semanticUriFragment));
    }
}
