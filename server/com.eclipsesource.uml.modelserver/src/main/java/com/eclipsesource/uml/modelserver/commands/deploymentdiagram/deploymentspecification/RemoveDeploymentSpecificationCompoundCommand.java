package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentspecification;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.DeploymentSpecification;
import org.eclipse.uml2.uml.Model;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemoveDeploymentSpecificationCompoundCommand extends CompoundCommand {

    public RemoveDeploymentSpecificationCompoundCommand(final EditingDomain domain, final URI modelUri,
                                                        final String semanticUriFragment, final String parentSemanticUri) {
        this.append(new RemoveDeploymentSpecificationCommand(domain, modelUri, semanticUriFragment, parentSemanticUri));
        this.append(new RemoveDeploymentSpecificationShapeCommand(domain, modelUri, semanticUriFragment));

        Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        DeploymentSpecification deploymentSpecificationToRemove = UmlSemanticCommandUtil.getElement(umlModel,
                semanticUriFragment, DeploymentSpecification.class);

        // TODO: check later again if this is needed somehow
        /*
         * Remove children
         * Collection<Setting> usagesNode = UsageCrossReferencer.find(nodeToRemove, umlModel.eResource());
         * for (Setting setting : usagesNode) {
         * EObject eObject = setting.getEObject();
         * if (isPropertyTypeUsage(setting, eObject, nodeToRemove)) {
         * String propertyUriFragment = UmlSemanticCommandUtil.getSemanticUriFragment((Property) eObject);
         * this.append(new SetPropertyTypeCommand(domain, modelUri, propertyUriFragment, null));
         * }
         * }
         */

    }

}
