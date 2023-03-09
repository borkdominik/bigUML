/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.util;

import java.util.function.Function;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.PackageableElement;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.StateMachine;

public class StateMachineSemanticCommandUtil {
   // STATEMACHINE DIAGRAM
   public static String getNewStateMachineName(final Model umlModel) {
      return getNewPackageableElementName(StateMachine.class, umlModel);
   }

   public static String getNewStateName(final Region containerRegion) {
      Function<Integer, String> nameProvider = i -> containerRegion.getName() + "NewState_" + i;
      int subVerticesCounter = containerRegion.getSubvertices().size();
      return nameProvider.apply(subVerticesCounter);
   }

   // TODO: check on this later again!
   // public static String getNewRegionName(final StateMachine stateMachine) {
   public static String getNewRegionName(final Model umlModel) {
      return getNewPackageableElementName((java.lang.Class<? extends PackageableElement>) Region.class, umlModel);
      /*
       * Function<Integer, String> nameProvider = i -> stateMachine.getName() +
       * "NewRegion_" + i;
       * int subVerticesCounter = stateMachine.getRegions().size();
       * return nameProvider.apply(subVerticesCounter);
       */
   }

   public static String getNewVertexName(final Region containerRegion) {
      Function<Integer, String> nameProvider = i -> containerRegion.getName() + "NewVertex_" + i;
      int subVerticesCounter = containerRegion.getSubvertices().size();
      return nameProvider.apply(subVerticesCounter);
   }

   public static String getNewFinalStateName(final Region containerRegion) {
      Function<Integer, String> nameProvider = i -> "NewFinalState_" + i;
      int subVerticesCounter = containerRegion.getSubvertices().size();
      return nameProvider.apply(subVerticesCounter);
   }

   private static String getNewPackageableElementName(final java.lang.Class<? extends PackageableElement> umlClassifier,
      final Model umlModel) {
      Function<Integer, String> nameProvider = i -> "New" + umlClassifier.getSimpleName() + i;

      int classifierCounter = umlModel.getPackagedElements().stream().filter(umlClassifier::isInstance)
         .collect(Collectors.toList()).size();

      return nameProvider.apply(classifierCounter);
   }

}
