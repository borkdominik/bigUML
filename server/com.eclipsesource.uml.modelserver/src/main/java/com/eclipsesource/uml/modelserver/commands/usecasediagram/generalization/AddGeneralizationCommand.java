package com.eclipsesource.uml.modelserver.commands.usecasediagram.generalization;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;

public class AddGeneralizationCommand extends UmlSemanticElementCommand {

    private final Generalization newGeneralization;
    protected final Classifier generalClassifier;
    protected final Classifier specificClassifier;

    public AddGeneralizationCommand(final EditingDomain domain, final URI modelUri, final String generalClassifierUri,
                                    final String specificClassifierUri) {
        super(domain, modelUri);
        this.newGeneralization = UMLFactory.eINSTANCE.createGeneralization();
        this.generalClassifier = UmlSemanticCommandUtil.getElement(umlModel, generalClassifierUri, Classifier.class);
        this.specificClassifier = UmlSemanticCommandUtil.getElement(umlModel, specificClassifierUri, Classifier.class);
    }

    @Override
    protected void doExecute() {

        generalClassifier.getGeneralizations().add(getNewGeneralization());
        getNewGeneralization().setGeneral(generalClassifier);
        getNewGeneralization().setSpecific(specificClassifier);

        /*System.out.println("general: " + generalClassifier + " & specific: " + specificClassifier);
        getNewGeneralization().setGeneral(generalClassifier);
        getNewGeneralization().setSpecific(specificClassifier);
        umlModel.getPackagedElements().add((PackageableElement) getNewGeneralization());*/
    }

    public Generalization getNewGeneralization() {
        return newGeneralization;
    }
}
